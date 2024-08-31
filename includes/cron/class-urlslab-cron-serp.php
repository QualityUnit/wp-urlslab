<?php

use FlowHunt_Vendor\OpenAPI\Client\ApiException;

require_once ABSPATH . 'wp-admin/includes/file.php';


class Urlslab_Cron_Serp extends Urlslab_Cron {
	private $has_rows = true;
	private ?Urlslab_Widget_Serp $widget;


	public function cron_exec( $max_execution_time = self::MAX_RUN_TIME ): bool {
		if ( ! $this->has_rows || ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Serp::SLUG ) || ! Urlslab_Widget_General::is_flowhunt_configured() ) {
			$this->has_rows = false;

			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG );

		if ( ! $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP ) ) {
			$this->has_rows = false;

			return false;
		}

		return parent::cron_exec( $max_execution_time );
	}

	public function get_description(): string {
		return __( 'Synchronizing SERP data', 'urlslab' );
	}


	/**
	 * @return array
	 */
	private function get_rows(): array {
		$has_user_type = false;
		$types         = $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_QUERY_TYPES );
		if ( is_string( $types ) ) {
			$types = explode( ',', $types );
		} else if ( empty( $types ) ) {
			$types = array();
		}
		foreach ( $types as $id => $type ) {
			$type = trim( $type );
			if ( isset( Urlslab_Data_Serp_Query::queryTypes()[ $type ] ) ) {
				if ( Urlslab_Data_Serp_Query::TYPE_USER === $type ) {
					$has_user_type = true;
					unset( $types[ $id ] );
				} else {
					$types[ $id ] = "'" . $type . "'";
				}
			} else {
				unset( $types[ $id ] );
			}
		}

		if ( $has_user_type ) {
			$rows = $this->get_rows_for_type( array( "'" . Urlslab_Data_Serp_Query::TYPE_USER . "'" ) );
			if ( ! empty( $rows ) ) {
				return $rows;
			}
		}
		if ( empty( $types ) ) {
			$this->has_rows = false;

			return array();
		}

		return $this->get_rows_for_type( $types );
	}

	private function get_rows_for_type( $types = array() ) {
		global $wpdb;

		if ( empty( $types ) ) {
			return array();
		}

		$types = implode( ',', $types );

		$query_data               = array();
		$query_data[]             = Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED;
		$query_data[]             = Urlslab_Data_Serp_Query::STATUS_PROCESSING;
		$query_data[] = Urlslab_Data::get_now();
		$query_data[]             = Urlslab_Data_Serp_Query::STATUS_PROCESSED;
		$query_data[] = Urlslab_Data::get_now();


		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' WHERE type IN (' . $types . ') AND (`status` = %s OR (`status` = %s AND schedule <= %s) OR (status=%s AND schedule <= %s) ) LIMIT 20', // phpcs:ignore
				$query_data
			),
			ARRAY_A
		); // phpcs:ignore

		return $rows;
	}


	protected function execute(): bool {
		if ( ! $this->has_rows || ! $this->widget->get_option( Urlslab_Widget_Serp::SETTING_NAME_SERP ) ) {
			return false;
		}

		$rows = $this->get_rows();
		if ( empty( $rows ) ) {
			$this->lock( 300, Urlslab_Cron::LOCK );
			$this->has_rows = false;

			return false;
		}

		$queries = array();
		foreach ( $rows as $row ) {
			$new_q = new Urlslab_Data_Serp_Query( $row );
			$new_q->set_status( Urlslab_Data_Serp_Query::STATUS_PROCESSING );
			$new_q->update();
			$queries[] = $new_q;
		}

		try {
			$serp_conn     = Urlslab_Connection_Serp::get_instance();
			$serp_response = $serp_conn->bulk_search_serp( $queries );
			$serp_conn->save_serp_response( $serp_response, $queries );
			Urlslab_Data_Serp_Query::update_serp_data();
			Urlslab_Data_Serp_Url::update_serp_data();
		} catch ( ApiException $e ) {
			if ( 402 === $e->getCode() ) {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_CREDITS, 0 );
				$this->lock( 300, Urlslab_Cron::LOCK );
			} else if ( 429 === $e->getCode() || 500 <= $e->getCode() ) {
				$this->lock( 60, Urlslab_Cron::LOCK );
			}
			foreach ( $queries as $query ) {
				$query->set_status( Urlslab_Data_Serp_Query::STATUS_NOT_PROCESSED );
				$query->update();
			}

			return false;
		}

		return true;
	}
}
