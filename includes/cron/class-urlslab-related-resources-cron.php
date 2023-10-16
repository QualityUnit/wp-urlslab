<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalContentQuery;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\ContentApi;
use Urlslab_Vendor\GuzzleHttp;

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Related_Resources_Cron extends Urlslab_Cron {
	private ContentApi $content_client;

	public function get_description(): string {
		return __( 'Updating related articles', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Related_Resources_Widget::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_SYNC_URLSLAB )
			 || ! $this->init_content_client()
		) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status=%d AND rel_schedule = %s OR (rel_schedule = %s AND rel_updated < %s) OR (rel_schedule = %s AND rel_updated < %s ) ORDER BY rel_updated LIMIT 1', // phpcs:ignore
				Urlslab_Url_Row::HTTP_STATUS_OK,
				Urlslab_Url_Row::REL_SCHEDULE_NEW,
				Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED,
				Urlslab_Data::get_now( time() - 24 * 3600 ), // retry if scheduled
				Urlslab_Url_Row::REL_AVAILABLE,
				Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_SYNC_FREQ ) ) // update ready values
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		$url->set_rel_updated( Urlslab_Data::get_now() );
		$url->update();

		return $this->update_related_resources( $url );
	}

	private function init_content_client(): bool {
		if ( empty( $this->content_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
			$this->content_client = new ContentApi( new GuzzleHttp\Client(), $config );
		}

		return ! empty( $this->content_client );
	}

	private function update_related_resources( Urlslab_Url_Row $url ) {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG );
		if ( empty( $url->get_domain_name() ) ) {
			$url->set_rel_schedule( Urlslab_Url_Row::REL_ERROR );
			$url->update();

			return true;
		}

		$max_count = $widget->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_ARTICLES_COUNT );
		if ( 10 > $max_count ) {
			$max_count = 15;
		}

		try {
			$related_urls_conn = Urlslab_Related_Urls_Connection::get_instance();
			$response = $related_urls_conn->get_related_urls_to_url(
				$url,
				$max_count,
				$widget->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_DOMAINS ),
				$widget->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_LAST_SEEN )
			);
			$url->set_rel_schedule( Urlslab_Url_Row::REL_AVAILABLE );
			$url->update();
			if ( empty( $response ) ) {
				return true;
			}

			$schedule_urls = array();
			foreach ( $response as $dest_url ) {
				try {
					$schedule_urls[] = new Urlslab_Url( $dest_url, true );
				} catch ( Exception $e ) {
				}
			}

			$url_objects       = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_urls( $schedule_urls );
			$related_resources = array();
			$pos               = 1;
			foreach ( $url_objects as $dest_url_obj ) {
				$related_resources[] = new Urlslab_Url_Relation_Row(
					array(
						'src_url_id'   => $url->get_url_id(),
						'dest_url_id'  => $dest_url_obj->get_url_id(),
						'pos'          => $pos,
						'is_locked'    => Urlslab_Url_Relation_Row::IS_LOCKED_NO,
						'created_date' => Urlslab_Data::get_now(),
					)
				);
				$pos ++;
			}

			global $wpdb;
			$wpdb->delete(
				URLSLAB_RELATED_RESOURCE_TABLE,
				array(
					'src_url_id' => $url->get_url_id(),
					'is_locked'  => Urlslab_Url_Relation_Row::IS_LOCKED_NO,
				)
			);

			( new Urlslab_Url_Relation_Row() )->insert_all( $related_resources, true );
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 404:
				case 429:
					$url->set_rel_schedule( Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED );
					$url->update();

					return true;

				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->update_option( Urlslab_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
					$url->set_rel_schedule( Urlslab_Url_Row::REL_SCHEDULE_NEW );
					$url->update();

					return false;

				default:
					return false;
			}
		}

		return true;
	}

}
