<?php

use OpenAPI\Client\ApiException;
use OpenAPI\Client\Configuration;
use OpenAPI\Client\Model\DomainDataRetrievalContentQuery;
use OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest;
use OpenAPI\Client\Urlslab\ContentApi;

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

		$request = new DomainDataRetrievalRelatedUrlsRequest();
		$request->setUrl( $url->get_url_name() );
		$request->setChunkLimit( 1 );
		$request->setRenewFrequency( DomainDataRetrievalRelatedUrlsRequest::RENEW_FREQUENCY_ONE_TIME );

		$query = new DomainDataRetrievalContentQuery();
		$query->setLimit( $max_count * 3 );

		$domains                            = $this->getOtherDomains();
		$domains[ $url->get_domain_name() ] = $url->get_domain_name();

		$query->setDomains( array_keys( $domains ) );
		$must_array = array( (object) array( 'term' => (object) array( 'metadata.chunk_id' => (object) array( 'value' => 1 ) ) ) );
		if ( $widget->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_LAST_SEEN ) > 0 ) {
			$must_array[] = (object) array( 'range' => (object) array( 'metadata.lastSeen' => (object) array( 'gte' => time() - $widget->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_LAST_SEEN ) ) ) );
		}
		$query->setAdditionalQuery( (object) array( 'bool' => (object) array( 'must' => $must_array ) ) );
		$request->setFilter( $query );

		try {
			$response = $this->content_client->getRelatedUrls( $request );
			$url->set_rel_schedule( Urlslab_Url_Row::REL_AVAILABLE );
			$url->update();
			if ( empty( $response->getUrls() ) ) {
				return true;
			}
			$dest_urls = array();
			foreach ( $response->getUrls() as $chunk ) {
				foreach ( $chunk as $dest_url ) {
					if ( count( $dest_urls ) < $max_count && ! in_array( $dest_url, $dest_urls ) ) {
						$dest_urls[] = $dest_url;
					}
				}
			}

			$schedule_urls = array();
			foreach ( $dest_urls as $dest_url ) {
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
						'created_date' => Urlslab_Data::get_now(),
					)
				);
				$pos ++;
			}

			global $wpdb;
			$wpdb->delete( URLSLAB_RELATED_RESOURCE_TABLE, array( 'src_url_id' => $url->get_url_id() ) );

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

	private function getOtherDomains(): array {
		$domains     = array();
		$str_domains = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_DOMAINS );
		if ( ! empty( $str_domains ) ) {
			$arr_domains = preg_split( '/(,|\n|\t)\s*/', $str_domains );
			foreach ( $arr_domains as $domain ) {
				$domain = trim( $domain );
				if ( strlen( $domain ) ) {
					try {
						$domain_url                                = new Urlslab_Url( $domain, true );
						$domains[ $domain_url->get_domain_name() ] = $domain_url->get_domain_name();
					} catch ( Exception $e ) {
					}
				}
			}
		}

		return $domains;
	}

}
