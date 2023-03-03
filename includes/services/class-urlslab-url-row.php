<?php

class Urlslab_Url_Row extends Urlslab_Data {

	public const VALUE_EMPTY = 'E';

	public const STATUS_BROKEN = 'B';
	public const STATUS_BLOCKED = 'X';
	public const STATUS_4XX = '4';
	public const STATUS_5XX = '5';
	public const STATUS_ACTIVE = 'A';
	public const STATUS_PENDING = 'P';
	public const STATUS_NEW = 'N';
	public const STATUS_RECURRING_UPDATE = 'U';


	public const VISIBILITY_VISIBLE = 'V';
	public const VISIBILITY_HIDDEN = 'H';


	public const SCREENSHOT_TYPE_CAROUSEL = 'carousel';
	public const SCREENSHOT_TYPE_FULL_PAGE = 'full-page';
	public const SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL = 'carousel-thumbnail';
	public const SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL = 'full-page-thumbnail';

	/**
	 * @param array $url
	 */
	public function __construct(
		array $url = array(), $loaded_from_db = true
	) {
		$this->set( 'urlMd5', $url['urlMd5'] ?? 0, ! $loaded_from_db );
		$this->set( 'urlName', $url['urlName'] ?? '', ! $loaded_from_db );
		$this->set( 'status', $url['status'] ?? '', ! $loaded_from_db );
		$this->set( 'domainId', $url['domainId'] ?? '', ! $loaded_from_db );
		$this->set( 'urlId', $url['urlId'] ?? '', ! $loaded_from_db );
		$this->set( 'screenshotDate', $url['screenshotDate'] ?? 0, ! $loaded_from_db );
		$this->set( 'updateStatusDate', $url['updateStatusDate'] ?? self::get_now(), ! $loaded_from_db );
		$this->set( 'urlCheckDate', $url['urlCheckDate'] ?? '', ! $loaded_from_db );
		$this->set( 'urlTitle', $url['urlTitle'] ?? '', ! $loaded_from_db );
		$this->set( 'urlMetaDescription', $url['urlMetaDescription'] ?? '', ! $loaded_from_db );
		$this->set( 'urlSummary', $url['urlSummary'] ?? '', ! $loaded_from_db );
		$this->set( 'visibility', $url['visibility'] ?? '', ! $loaded_from_db );
	}

	function get_table_name(): string {
		return URLSLAB_URLS_TABLE;
	}

	function get_primary_columns(): array {
		return array( 'urlMd5' );
	}

	public function get_url(): Urlslab_Url {
		return new Urlslab_Url( $this->get( 'urlName' ), true );
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

	public function get( $name ) {
		switch ( $name ) {
			case 'urlSummary':
				//continue to next option
			case 'urlTitle':
				//continue to next option
			case 'urlMetaDescription':
				if ( Urlslab_Url_Row::VALUE_EMPTY == parent::get( $name ) ) {
					return '';
				} //continue to next option
			default:
		}

		return parent::get( $name );
	}

	public function get_summary( $strategy ): string {

		switch ( $strategy ) {

			case Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY:
				if ( ! empty( trim( $this->get( 'urlSummary' ) ) ) ) {
					return trim( $this->get( 'urlSummary' ) );
				} //continue to next option
			case Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION:
				if ( ! empty( trim( $this->get( 'urlMetaDescription' ) ) ) ) {
					return trim( $this->get( 'urlMetaDescription' ) );
				} //continue to next option
			case Urlslab_Link_Enhancer::DESC_TEXT_TITLE:
				if ( ! empty( trim( $this->get( 'urlTitle' ) ) ) ) {
					return trim( $this->get( 'urlTitle' ) );
				} //continue to next option
			case Urlslab_Link_Enhancer::DESC_TEXT_URL:
			default:
		}

		return ucwords(
			trim(
				trim(
					trim(
						str_replace(
							'/',
							' - ',
							str_replace(
								array(
									'-',
									'_',
									'+',
								),
								' ',
								$this->get_url()->get_url_path()
							)
						)
					),
					'-'
				)
			)
		);
	}

	/**
	 * @param string $screenshot_type
	 *
	 * @return string url of the schreenshot or empty string
	 */
	public function get_screenshot_url( string $screenshot_type = self::SCREENSHOT_TYPE_CAROUSEL ): string {
		if ( empty( $this->get( 'screenshotDate' ) ) || empty( $this->get( 'domainId' ) ) || empty( $this->get( 'urlId' ) ) ) {
			return '';
		}
		switch ( $screenshot_type ) {
			case self::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL:
				$path = 'https://www.urlslab.com/public/thumbnail/fullpage/%s/%s/%s';
				break;
			case self::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL:
				$path = 'https://www.urlslab.com/public/thumbnail/carousel/%s/%s/%s';
				break;
			case self::SCREENSHOT_TYPE_FULL_PAGE:
				$path = 'https://www.urlslab.com/public/image/%s/%s/%s';
				break;
			case self::SCREENSHOT_TYPE_CAROUSEL:
			default:
				$path = 'https://www.urlslab.com/public/carousel/%s/%s/%s';
				break;
		}

		return sprintf(
			$path,
			$this->get( 'domainId' ),
			$this->get( 'urlId' ),
			$this->get( 'screenshotDate' )
		);
	}

	public function is_active() {
		return ( self::STATUS_ACTIVE === $this->get( 'status' ) || self::STATUS_RECURRING_UPDATE == $this->get( 'status' ) ) && self::VISIBILITY_HIDDEN != $this->get( 'visibility' );
	}

	public function is_visible() {
		return self::VISIBILITY_HIDDEN != $this->get( 'visibility' );
	}

}
