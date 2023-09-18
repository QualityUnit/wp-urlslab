<?php

use Urlslab_Vendor\OpenAPI\Client\ApiException;
use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalDataRequest;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSummaryResponse;
use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalVideoCaptionResponse;
use Urlslab_Vendor\OpenAPI\Client\Urlslab\SummaryApi;
use Urlslab_Vendor\GuzzleHttp;

class Urlslab_Summaries_Helper {

	private static Urlslab_Summaries_Helper $instance;
	private static SummaryApi $summary_client;

	public static function get_instance(): Urlslab_Summaries_Helper {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$summary_client ) && Urlslab_General::is_urlslab_active() ) {
			$api_key              = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
			$config               = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
            self::$summary_client = new SummaryApi( new GuzzleHttp\Client( array( 'timeout' => 59 ) ), $config ); //phpcs:ignore
			return ! empty( self::$summary_client );
		}

		throw new \Urlslab_Vendor\OpenAPI\Client\ApiException( 'Not Enough Credits', 402, array( 'status' => 402 ) );

	}


	public function fetch_summaries( array $url_rows, $renew_frequency = DomainDataRetrievalDataRequest::RENEW_FREQUENCY_ONE_TIME ) {
		global $wpdb;

		$data   = array();
		$data[] = Urlslab_Data::get_now();
		$data[] = Urlslab_Url_Row::SUM_STATUS_PENDING;

		$url_names = array();

		$url_objects = array();

		foreach ( $url_rows as $row ) {
			$row_obj = new Urlslab_Url_Row( $row );
			if ( $row_obj->get_url()->is_url_valid() ) {
				$url_objects[] = $row_obj;
				$data[]        = $row['url_id'];
				$url_names[]   = $row['url_name'];
			} else {
				$row_obj->set_sum_status( Urlslab_Url_Row::SCR_STATUS_ERROR );
				$row_obj->update();
			}
		}

        $wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' SET update_sum_date=%s, sum_status=%s WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_rows ), '%d' ) ) . ')', $data ) ); // phpcs:ignore

		return $this->fetch_summaries_from_urlslab( $url_names, $url_objects, $renew_frequency );


	}

	public function fetch_summaries_from_urlslab( array $url_names, array $url_objects, $renew_frequency ) {
		$request = new DomainDataRetrievalDataRequest();
		$request->setUrls( $url_names );
		$request->setRenewFrequency( $renew_frequency );
		$urlslab_summaries = self::$summary_client->getSummary( $request );
		foreach ( $urlslab_summaries as $id => $summary ) {
			switch ( $summary->getSummaryStatus() ) {
				case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_REDIRECTED:
				case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_BLOCKED:
					$url_objects[ $id ]->set_sum_status( Urlslab_Url_Row::SUM_STATUS_ERROR );
					$url_objects[ $id ]->update();

					break;

				case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_AVAILABLE:
					$url_objects[ $id ]->set_urlslab_domain_id( $summary->getDomainId() );
					$url_objects[ $id ]->set_urlslab_url_id( $summary->getUrlId() );
					$url_objects[ $id ]->set_urlslab_sum_timestamp( time() );       // TODO: api has no info when was summary generated?
					$url_objects[ $id ]->set_url_summary( $summary->getSummary() ); // TODO: api has no info when was summary generated?
					$url_objects[ $id ]->set_sum_status( Urlslab_Url_Row::SUM_STATUS_ACTIVE );
					$url_objects[ $id ]->update();

					break;

				case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_PENDING:
				case DomainDataRetrievalSummaryResponse::SUMMARY_STATUS_UPDATING:
				default:
					// we will leave object in the status pending
			}
		}

		return $urlslab_summaries;
	}




}
