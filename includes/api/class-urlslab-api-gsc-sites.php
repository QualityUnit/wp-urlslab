<?php

use Urlslab_Vendor\OpenAPI\Client\Configuration;
use Urlslab_Vendor\GuzzleHttp;
use Urlslab_Vendor\OpenAPI\Client\ApiException;

class Urlslab_Api_Gsc_Sites extends Urlslab_Api_Table {
	const SLUG = 'gsc-sites';

	public function register_routes() {
		$base = '/' . self::SLUG;

		register_rest_route( self::NAMESPACE, $base . '/', $this->get_route_get_items() );
		register_rest_route( self::NAMESPACE, $base . '/count', $this->get_count_route( array( $this->get_route_get_items() ) ) );

		register_rest_route(
			self::NAMESPACE,
			$base . '/(?P<site_id>[0-9]+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array(
						$this,
						'update_item_permissions_check',
					),
					'args'                => array(
						'importing' => array(
							'required'          => false,
							'validate_callback' => function( $param ) {
								return is_bool( $param ) || Urlslab_Gsc_Site_Row::IMPORTING_YES === $param || Urlslab_Gsc_Site_Row::IMPORTING_NO === $param;
							},
						),
					),
				),
			)
		);
	}

	public function get_row_object( $params = array(), $loaded_from_db = true ): Urlslab_Data {
		return new Urlslab_Gsc_Site_Row( $params, $loaded_from_db );
	}

	public function get_editable_columns(): array {
		return array( 'importing' );
	}

	protected function get_items_sql( WP_REST_Request $request ): Urlslab_Api_Table_Sql {
		$this->import_gsc_sites();

		$sql = new Urlslab_Api_Table_Sql( $request );
		$sql->add_select_column( '*' );
		$sql->add_from( URLSLAB_GSC_SITES_TABLE );
		$columns = $this->prepare_columns( $this->get_row_object()->get_columns() );
		$sql->add_filters( $columns, $request );
		$sql->add_sorting( $columns, $request );

		return $sql;
	}

	private function get_route_get_items(): array {
		return array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'get_items' ),
			'args'                => $this->get_table_arguments(),
			'permission_callback' => array(
				$this,
				'get_items_permissions_check',
			),
		);
	}


	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_items( $request ) {
		$rows = $this->get_items_sql( $request )->get_results();

		if ( is_wp_error( $rows ) ) {
			return new WP_Error( 'error', __( 'Failed to get items', 'urlslab' ), array( 'status' => 400 ) );
		}

		foreach ( $rows as $row ) {
			$row->site_id   = (int) $row->site_id;
			$row->importing = Urlslab_Gsc_Site_Row::IMPORTING_YES === $row->importing;
		}

		return new WP_REST_Response( $rows, 200 );
	}

	protected function validate_item( Urlslab_Data $row ) {
		parent::validate_item( $row );
		if ( $row->get_public( 'importing' ) === Urlslab_Gsc_Site_Row::IMPORTING_YES ) {
			$row->set_public( 'row_offset', 0 );
			$row->set_public( 'date_to', gmdate( 'Y-m-d', strtotime( '-1 days' ) ) );
		}
	}

	private function import_gsc_sites() {
		if (
			time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG )->get_option( Urlslab_Serp::SETTING_NAME_GSC_IMPORT_TIMESTAMP ) > 900 &&
			Urlslab_General::is_urlslab_active()
		) {
			try {
				Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Serp::SLUG )->update_option( Urlslab_Serp::SETTING_NAME_GSC_IMPORT_TIMESTAMP, time() );
				$api_key          = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_General::SLUG )->get_option( Urlslab_General::SETTING_NAME_URLSLAB_API_KEY );
				$config           = Configuration::getDefaultConfiguration()->setApiKey( 'X-URLSLAB-KEY', $api_key );
				$analytics_client = new \Urlslab_Vendor\OpenAPI\Client\Urlslab\AnalyticsApi( new GuzzleHttp\Client(), $config );
				$site_urls        = $analytics_client->getSiteUrls();
				$site_urls        = $site_urls->getSiteUrls();
				$sites            = array();
				foreach ( $site_urls as $site_url ) {
					$site_row = new Urlslab_Gsc_Site_Row( array( 'site_name' => $site_url ) );
					$sites[]  = $site_row;
				}
				$sites[0]->insert_all( $sites, true );
			} catch ( ApiException $e ) {
			}
		}
	}

}
