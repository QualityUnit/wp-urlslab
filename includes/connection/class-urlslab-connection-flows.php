<?php


use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\ApiException;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\FlowsApi;
use FlowHunt_Vendor\OpenAPI\Client\Model\FlowInvokeRequest;
use FlowHunt_Vendor\OpenAPI\Client\Model\TaskStatus;

class Urlslab_Connection_Flows {

	private static Urlslab_Connection_Flows $instance;
	private static FlowsApi $client;

	public static function get_instance(): Urlslab_Connection_Flows {
		if ( empty( self::$instance ) ) {
			if ( self::init_client() ) {
				self::$instance = new self();
			}
		}

		return self::$instance;
	}

	private static function init_client(): bool {
		if ( empty( self::$client ) && Urlslab_Widget_General::is_flowhunt_configured() ) {
			self::$client = new FlowsApi( new Client( array( 'timeout' => 59 ) ), Urlslab_Connection_FlowHunt::getConfiguration() ); //phpcs:ignore
			return ! empty( self::$client );
		}

		throw new ApiException( esc_html( __( 'Not Enough Credits', 'urlslab' ) ), 402, array( 'status' => 402 ) );
	}


	public function update_summary( Urlslab_Data_Url $row_obj ) {
		if ( $row_obj->get_url()->is_url_valid() ) {
			$row_obj->set_sum_status( Urlslab_Data_Url::SCR_STATUS_PENDING );
			$row_obj->update();
		} else {
			$row_obj->set_sum_status( Urlslab_Data_Url::SCR_STATUS_ERROR );
			$row_obj->update();
			return false;
		}

		$request = new FlowInvokeRequest( array( 'human_input' => 'https:' . $row_obj->get_url()->get_url_with_protocol_relative() ) );

		$result = self::$client->invokeFlow( '5b9daf7e-d7b8-4ee3-9a84-345703c628cb', Urlslab_Connection_FlowHunt::getWorkspaceId(), $request );

		switch ( $result->getStatus() ) {
			case TaskStatus::SUCCESS:
				$arr_result = json_decode( $result->getResult(), true );
				if ( isset( $arr_result['outputs'][0]['outputs'][0]['results']['result'] ) ) {
					$row_obj->set_sum_status( Urlslab_Data_Url::SUM_STATUS_ACTIVE );
					$row_obj->set_url_summary( trim( $arr_result['outputs'][0]['outputs'][0]['results']['result'], '"' ) );
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
