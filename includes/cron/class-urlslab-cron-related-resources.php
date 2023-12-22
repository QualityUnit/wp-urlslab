<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Cron_Related_Resources extends Urlslab_Cron {

	public function get_description(): string {
		return __( 'Updating related articles', 'urlslab' );
	}

	protected function execute(): bool {
		global $wpdb;

		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Related_Resources::SLUG )
			 || ! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Related_Resources::SLUG )->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_SYNC_URLSLAB )
			 || ! Urlslab_Widget_General::is_urlslab_active()
		) {
			return false;
		}

		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status=%d AND rel_schedule = %s OR (rel_schedule = %s AND rel_updated < %s) OR (rel_schedule = %s AND rel_updated < %s ) ORDER BY rel_updated LIMIT 1', // phpcs:ignore
				Urlslab_Data_Url::HTTP_STATUS_OK,
				Urlslab_Data_Url::REL_SCHEDULE_NEW,
				Urlslab_Data_Url::REL_SCHEDULE_SCHEDULED,
				Urlslab_Data::get_now( time() - 24 * 3600 ), // retry if scheduled
				Urlslab_Data_Url::REL_AVAILABLE,
				Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Related_Resources::SLUG )->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_SYNC_FREQ ) ) // update ready values
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		$url = new Urlslab_Data_Url( $url_row );
		$url->set_rel_updated( Urlslab_Data::get_now() );
		$url->update();

		return $this->update_related_resources( $url );
	}

	private function update_related_resources( Urlslab_Data_Url $url ) {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Related_Resources::SLUG );
		if ( empty( $url->get_domain_name() ) || $url->get_url()->is_blacklisted() ) {
			$url->set_rel_schedule( Urlslab_Data_Url::REL_ERROR );
			$url->update();

			return true;
		}

		$max_count = $widget->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_ARTICLES_COUNT );
		if ( 10 > $max_count ) {
			$max_count = 15;
		}

		try {
			$related_urls_conn = Urlslab_Connection_Related_Urls::get_instance();
			$response          = $related_urls_conn->get_related_urls_to_url(
				$url,
				$max_count,
				$widget->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_DOMAINS ),
				$widget->get_option( Urlslab_Widget_Related_Resources::SETTING_NAME_LAST_SEEN )
			);
			$url->set_rel_schedule( Urlslab_Data_Url::REL_AVAILABLE );
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

			$url_objects       = Urlslab_Data_Url_Fetcher::get_instance()->load_and_schedule_urls( $schedule_urls );
			$related_resources = array();
			$pos               = 1;
			foreach ( $url_objects as $dest_url_obj ) {
				$related_resources[] = new Urlslab_Data_Url_Relation(
					array(
						'src_url_id'   => $url->get_url_id(),
						'dest_url_id'  => $dest_url_obj->get_url_id(),
						'pos'          => $pos,
						'is_locked'    => Urlslab_Data_Url_Relation::IS_LOCKED_NO,
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
					'is_locked'  => Urlslab_Data_Url_Relation::IS_LOCKED_NO,
				)
			);

			( new Urlslab_Data_Url_Relation() )->insert_all( $related_resources, true );
		} catch ( ApiException $e ) {
			switch ( $e->getCode() ) {
				case 404:
				case 429:
					$url->set_rel_schedule( Urlslab_Data_Url::REL_SCHEDULE_SCHEDULED );
					$url->update();

					return true;

				case 402:
					Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_URLSLAB_CREDITS, 0 );
					$url->set_rel_schedule( Urlslab_Data_Url::REL_SCHEDULE_NEW );
					$url->update();

					return false;

				default:
					return false;
			}
		}

		return true;
	}

}
