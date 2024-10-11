<?php

use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\Model\FlowInvokeRequest;
use FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus;

class Urlslab_Cron_Summaries extends Urlslab_Cron {

	public function get_description(): string {
		return __( 'Syncing summaries generated by URLsLab service to local database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( empty( Urlslab_Connection_Flows::get_instance() ) || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Urls::SLUG ) ) {
			return false;
		}

		global $wpdb;

		$query_data = array();
		$use_index  = '';

		if ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_option( Urlslab_Widget_Urls::SETTING_NAME_VALIDATE_LINKS ) ) {
			$query_data[]          = Urlslab_Data_Url::HTTP_STATUS_OK;
			$sql_where_http_status = ' http_status = %d AND';
			$use_index             = ' USE INDEX (idx_sum_cron)';
		} else {
			$sql_where_http_status = '';
		}

		$query_data[] = Urlslab_Data_Url::SUM_STATUS_PENDING;
		$query_data[] = Urlslab_Data::get_now( time() - 900 );
		$query_data[] = Urlslab_Data_Url::SUM_STATUS_NEW;
		$query_data[] = Urlslab_Data_Url::SUM_STATUS_ACTIVE;
		$query_data[] = Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_option( Urlslab_Widget_Urls::SETTING_NAME_SUMMARIZATION_REFRESH_INTERVAL ) );

		$url_rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . $use_index . ' WHERE ' . $sql_where_http_status . ' ((sum_status =%s AND update_sum_date < %s) OR sum_status = %s OR (sum_status = %s AND update_sum_date < %s)) LIMIT 20', // phpcs:ignore
				$query_data,
			),
			ARRAY_A
		);
		if ( empty( $url_rows ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );

			return false;
		}

		try {
			foreach ( $url_rows as $row ) {
				$url_obj = new Urlslab_Data_Url( $row, true );
				if ( ! $url_obj->get_url()->is_url_valid() || $url_obj->get_url()->is_blacklisted() ) {
					$url_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_ERROR );
					$url_obj->update();
					continue;
				}

				$this->update_summary( $url_obj );
			}
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 );
				$this->lock( 300, Urlslab_Cron::LOCK );

				return false;
			} else if ( 429 === $e->getCode() || 500 <= $e->getCode() ) {
				$this->lock( 60, Urlslab_Cron::LOCK );
			}
		}

		return false;    // 100 URLs per execution is enought if there was no url updated
	}

	public function update_summary( Urlslab_Data_Url $row_obj ) {
		if ( $row_obj->get_url()->is_url_valid() ) {
			$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_PENDING );
			$row_obj->update();
		} else {
			$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_ERROR );
			$row_obj->update();
			return false;
		}

		$request = new FlowInvokeRequest( array( 'human_input' => 'https:' . $row_obj->get_url()->get_url_with_protocol_relative() ) );

		$result = Urlslab_Connection_Flows::get_instance()->get_client()->invokeFlowSingleton( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG )->get_option( Urlslab_Widget_Urls::SETTING_NAME_SUMMARIZATION_FLOW ), Urlslab_Connection_FlowHunt::get_workspace_id(), $request );

		switch ( $result->getStatus() ) {
			case TaskStatus::SUCCESS:
				$arr_result = json_decode( $result->getResult(), true );
				if ( isset( $arr_result['outputs'][0]['outputs'][0]['results']['message']['result'] ) ) {
					$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_ACTIVE );
					$row_obj->set_url_summary( trim( $arr_result['outputs'][0]['outputs'][0]['results']['message']['result'], '"' ) );
				} else {
					$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_ERROR );
				}
				break;
			case TaskStatus::FAILURE:
			case TaskStatus::IGNORED:
			case TaskStatus::REJECTED:
				$row_obj->set_sum_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
				break;
			default:
		}
		$row_obj->update();
		return true;
	}
}
