<?php

class Urlslab_Url_Row extends Urlslab_Data {

	public const VALUE_EMPTY = 'E';

	public const STATUS_BROKEN = 'B';
	public const STATUS_4XX = '4';
	public const STATUS_5XX = '5';
	public const STATUS_ACTIVE = 'A';
	public const STATUS_PENDING = 'P';
	public const STATUS_NEW = 'N';

	/**
	 * @param array $url
	 */
	public function __construct(
		array $url = array(), $loaded_from_db = true
	) {
		$this->set( 'urlMd5', $url['urlMd5'], ! $loaded_from_db );
		$this->set( 'urlName', $url['urlName'], ! $loaded_from_db );
		$this->set( 'status', $url['status'], ! $loaded_from_db );
		$this->set( 'domainId', $url['domainId'], ! $loaded_from_db );
		$this->set( 'urlId', $url['urlId'], ! $loaded_from_db );
		$this->set( 'screenshotDate', $url['screenshotDate'], ! $loaded_from_db );
		$this->set( 'updateStatusDate', $url['updateStatusDate'] ?? self::get_now(), ! $loaded_from_db );
		$this->set( 'urlCheckDate', $url['urlCheckDate'] ?? '', ! $loaded_from_db );
		$this->set( 'urlTitle', $url['urlTitle'], ! $loaded_from_db );
		$this->set( 'urlMetaDescription', $url['urlMetaDescription'], ! $loaded_from_db );
		$this->set( 'urlSummary', $url['urlSummary'], ! $loaded_from_db );
		$this->set( 'visibility', $url['visibility'], ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_URLS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'urlMd5' );
	}

	public function get_url(): Urlslab_Url {
		return new Urlslab_Url( urlslab_add_current_page_protocol( $this->get( 'urlName' ) ) );
	}

	function get_columns(): array {
		return array(
			'urlMd5'             => '%d',
			'urlName'            => '%s',
			'status'             => '%s',
			'domainId'           => '%s',
			'urlId'              => '%s',
			'screenshotDate'     => '%d',
			'updateStatusDate'   => '%s',
			'urlCheckDate'       => '%s',
			'urlTitle'           => '%s',
			'urlMetaDescription' => '%s',
			'urlSummary'         => '%s',
			'visibility'         => '%s',
		);
	}
}
