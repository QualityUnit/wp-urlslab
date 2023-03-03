<?php

class Urlslab_CSS_Cache_Row extends Urlslab_Data {
	const STATUS_ACTIVE = 'A';
	const STATUS_NEW = 'N';
	const STATUS_PENDING = 'P';
	const STATUS_DISABLED = 'D';

	private Urlslab_Url $url_object;

	/**
	 * @param array $url
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set( 'url', $url['url'] ?? '', ! $loaded_from_db );
		if ( isset( $url['url_id'] ) ) {
			$url_id = $url['url_id'];
		} else {
			try {
				$url_obj = new Urlslab_Url( $this->get( 'url' ) );
				$url_id  = $url_obj->get_url_id();
			} catch ( Exception $e ) {
				$url_id = 'invalid_url';
			}
		}
		$this->set( 'url_id', $url_id, ! $loaded_from_db );
		$this->set( 'status', $url['status'] ?? self::STATUS_NEW, ! $loaded_from_db );
		$this->set( 'status_changed', $url['status_changed'] ?? self::get_now(), ! $loaded_from_db );
		$this->set( 'filesize', $url['filesize'] ?? 0, ! $loaded_from_db );
		$this->set( 'css_content', $url['css_content'] ?? '', ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_CSS_CACHE_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'url_id' );
	}

	public function get_url(): Urlslab_Url {
		return new Urlslab_Url( $this->get( 'url' ), true );
	}

	function get_columns(): array {
		return array(
			'url'            => '%s',
			'url_id'         => '%d',
			'status'         => '%s',
			'status_changed' => '%s',
			'filesize'       => '%d',
			'css_content'    => '%s',
		);
	}

	public static function get_css_files( array $url_ids ): array {
		global $wpdb;
		$css_files = array();
		if ( ! empty( $url_ids ) ) {
			$results = $wpdb->get_results(
				$wpdb->prepare(
					'SELECT *	FROM ' . URLSLAB_CSS_CACHE_TABLE . ' WHERE url_id in (' . trim( str_repeat( '%s,', count( $url_ids ) ), ',' ) . ')', // phpcs:ignore
					$url_ids
				),
				'ARRAY_A'
			);
			foreach ( $results as $css_file_array ) {
				$css_file_obj                                = new Urlslab_CSS_Cache_Row( $css_file_array );
				$css_files[ $css_file_obj->get( 'url_id' ) ] = $css_file_obj;
			}
		}

		return $css_files;
	}
}
