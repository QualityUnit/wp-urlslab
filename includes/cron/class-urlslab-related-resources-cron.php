<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Related_Resources_Cron extends Urlslab_Cron {

	private \OpenAPI\Client\Urlslab\ContentApi $content_client;
	private \OpenAPI\Client\Urlslab\ScheduleApi $schedule_client;

	private function init_content_client(): bool {
		if ( empty( $this->content_client ) ) {
			$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			if ( strlen( $api_key ) ) {
				$config               = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
				$this->content_client = new \OpenAPI\Client\Urlslab\ContentApi( new GuzzleHttp\Client(), $config );
			}
		}

		return ! empty( $this->content_client );
	}

	private function init_schedule_client(): bool {
		if ( empty( $this->schedule_client ) ) {
			$api_key = get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			if ( strlen( $api_key ) ) {
				$config                = \OpenAPI\Client\Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
				$this->schedule_client = new \OpenAPI\Client\Urlslab\ScheduleApi( new GuzzleHttp\Client(), $config );
			}
		}

		return ! empty( $this->schedule_client );
	}

	protected function execute(): bool {
		global $wpdb;

		if (
			! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Related_Resources_Widget::SLUG ) ||
			! Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_SYNC_URLSLAB ) ||
			! $this->init_content_client()
		) {
			return false;
		}


		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE rel_schedule = %s OR (rel_schedule = %s AND rel_updated < %s) OR (rel_schedule = %s AND rel_updated < %s ) ORDER BY rel_updated LIMIT 1', // phpcs:ignore
				Urlslab_Url_Row::REL_SCHEDULE_NEW,
				Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED,
				Urlslab_Data::get_now( time() - 24 * 3600 ),    //retry if scheduled
				Urlslab_Url_Row::REL_AVAILABLE,
				Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Related_Resources_Widget::SLUG )->get_option( Urlslab_Related_Resources_Widget::SETTING_NAME_SYNC_FREQ ) ) //update ready values
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );
		$url->set_rel_updated( Urlslab_Data::get_now() );
		$url->update();

		switch ( $url->get_rel_schedule() ) {
			case Urlslab_Url_Row::REL_SCHEDULE_NEW:
				return $this->schedule( $url );
			case Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED:
			case Urlslab_Url_Row::REL_AVAILABLE:
				return $this->update_related_resources( $url );
			default:
				return false;
		}
	}

	public function get_description(): string {
		return __( 'Updating related articles', 'urlslab' );
	}

	private function update_related_resources( Urlslab_Url_Row $url ) {
		if ( empty( $url->get_domain_name() ) ) {
			$url->set_rel_schedule( Urlslab_Url_Row::REL_ERROR );
			$url->update();

			return true;
		}

		$request = new \OpenAPI\Client\Model\DomainDataRetrievalRelatedUrlsRequest();
		$request->setUrl( $url->get_url_name() );
		$request->setChunkLimit( 5 );

		$query = new \OpenAPI\Client\Model\DomainDataRetrievalContentQuery();
		$query->setLimit( 10 );
		$query->setQuery(
			(object) array(
				'term' => (object) array(
					'metadata.domain.keyword' => (object) array(
						'value' => $url->get_domain_name(),
					),
				),
			)
		);
		$request->setFilter( $query );
		try {
			$response = $this->content_client->getRelatedUrls( $request );
			if ( empty( $response->getUrls() ) ) {
				return true;
			}
			$dest_urls = array();
			foreach ( $response->getUrls() as $chunk ) {
				foreach ( $chunk as $dest_url ) {
					if ( ! in_array( $dest_url, $dest_urls ) ) {
						$dest_urls[] = $dest_url;
					}
				}
			}

			$schedule_urls = array();
			foreach ( $dest_urls as $dest_url ) {
				$schedule_urls[] = new Urlslab_Url( $dest_url );
			}

			$url_objects       = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_urls( $schedule_urls );
			$related_resources = array();
			foreach ( $url_objects as $dest_url_obj ) {
				$related_resources[] = new Urlslab_Url_Relation_Row(
					array(
						'src_url_id'  => $url->get_url_id(),
						'dest_url_id' => $dest_url_obj->get_url_id(),
					)
				);
			}

			global $wpdb;
			$wpdb->delete( URLSLAB_URL_RELATIONS_TABLE, array( 'src_url_id' => $url->get_url_id() ) );

			( new Urlslab_Url_Relation_Row() )->insert_all( $related_resources, true );
			$url->set_rel_schedule( Urlslab_Url_Row::REL_AVAILABLE );
			$url->update();
		} catch ( \OpenAPI\Client\ApiException $e ) {
			return false;
		}

		return true;
	}

	private function schedule( Urlslab_Url_Row $url ): bool {

		if ( ! $url->get_url()->is_url_valid() || Urlslab_Url_Row::SUM_STATUS_ERROR == $url->get_sum_status() || $url->get_url()->is_url_blacklisted() || ! $url->is_visible() ) {
			$url->set_rel_schedule( Urlslab_Url_Row::REL_ERROR );
			$url->update();

			return true;
		}

		try {
			if ( ! $this->init_schedule_client() ) {
				return false;
			}

			$config = new \OpenAPI\Client\Model\DomainScheduleScheduleConf();
			$config->setUrls( array( $url->get_url()->get_url() ) );
			$config->setTakeScreenshot( false );
			$config->setScanFrequency( \OpenAPI\Client\Model\DomainScheduleScheduleConf::SCAN_FREQUENCY_ONE_TIME );
			$config->setScanSpeedPerMinute( 20 );
			$config->setFetchText( true );
			$config->setLinkFollowingStrategy( \OpenAPI\Client\Model\DomainScheduleScheduleConf::LINK_FOLLOWING_STRATEGY_NO_LINK );
			$config->setAllSitemaps( false );
			$config->setSitemaps( array() );
			$this->schedule_client->createSchedule( $config );

			$url->set_rel_schedule( Urlslab_Url_Row::REL_SCHEDULE_SCHEDULED );
			$url->update();

			return true;
		} catch ( \OpenAPI\Client\ApiException $e ) {
			return false;
		}
	}
}
