<?php

class Urlslab_Url_Data {

	private $domain_id;
	private $url_id;

	private Urlslab_Url $url;
	private $screenshot_date;
	private $last_status_change_date;
	private $url_check_date;
	private ?string $url_title;
	private ?string $url_meta_description;
	private ?string $url_summary;
	private ?string $screenshot_status;
	private ?string $visibility = Urlslab_Url_Row::VISIBILITY_VISIBLE;

	/**
	 * @param Urlslab_Url $url
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $last_status_change_date
	 * @param $url_check_date
	 * @param $url_title
	 * @param $url_meta_description
	 * @param $url_summary
	 * @param $screenshot_status
	 * @param string $visibility
	 */
	public function __construct(
		Urlslab_Url $url,
		$domain_id,
		$url_id,
		$screenshot_date,
		$last_status_change_date,
		$url_check_date,
		$url_title,
		$url_meta_description,
		$url_summary,
		$screenshot_status,
		$visibility = Urlslab_Url_Row::VISIBILITY_VISIBLE
	) {
		$this->url                     = $url;
		$this->domain_id               = $domain_id;
		$this->url_id                  = $url_id;
		$this->screenshot_date         = $screenshot_date;
		$this->last_status_change_date = $last_status_change_date;
		$this->url_check_date          = $url_check_date;
		$this->url_title               = $url_title;
		$this->url_meta_description    = $url_meta_description;
		$this->url_summary             = $url_summary;
		$this->screenshot_status       = $screenshot_status;
		$this->visibility              = $visibility;
	}

	static function empty( Urlslab_Url $url, string $urlslab_status ): Urlslab_Url_Data {
		return new Urlslab_Url_Data(
			$url,
			'',
			$url->get_url_id(),
			null,
			null,
			null,
			null,
			null,
			null,
			$urlslab_status,
			Urlslab_Url_Row::VISIBILITY_VISIBLE
		);
	}

	/**
	 * @return mixed
	 */
	public function get_last_status_change_date() {
		return $this->last_status_change_date;
	}

	/**
	 * @return mixed
	 */
	public function get_domain_id() {
		return $this->domain_id;
	}

	/**
	 * @return mixed
	 */
	public function get_url_id() {
		return $this->url_id;
	}

	/**
	 * @return Urlslab_Url
	 */
	public function get_url(): Urlslab_Url {
		return $this->url;
	}

	/**
	 * @return mixed
	 */
	public function get_screenshot_date() {
		return $this->screenshot_date;
	}

	/**
	 * @return string
	 */
	public function get_url_title(): string {
		if ( Urlslab_Url_Row::VALUE_EMPTY == $this->url_title ) {
			return '';
		}

		return $this->url_title ?? '';
	}

	/**
	 * @return string
	 */
	public function get_url_meta_description(): string {
		if ( Urlslab_Url_Row::VALUE_EMPTY == $this->url_meta_description ) {
			return '';
		}

		return $this->url_meta_description ?? '';
	}

	/**
	 * @return string
	 */
	public function get_url_summary(): string {
		return $this->url_summary ?? '';
	}

	/**
	 * @return string
	 */
	public function get_screenshot_status(): string {
		return $this->screenshot_status;
	}

	public function screenshot_exists(): bool {
		return 'A' == $this->screenshot_status;
	}

	public function is_empty(): bool {
		return (
			! $this->screenshot_exists() &&
			is_null( $this->url_summary ) &&
			is_null( $this->url_meta_description ) &&
			is_null( $this->url_title )
		);
	}

	public function is_visible() {
		return Urlslab_Url_Row::VISIBILITY_VISIBLE === $this->visibility && Urlslab_Url_Row::STATUS_4XX !== $this->screenshot_status && Urlslab_Url_Row::STATUS_5XX !== $this->screenshot_status;
	}

	/**
	 * @param string $screenshot_type
	 *
	 * @return string
	 */
	public function render_screenshot_path( string $screenshot_type = 'carousel' ): string {
		switch ( $screenshot_type ) {
			case 'full-page-thumbnail':
				return sprintf(
					'https://www.urlslab.com/public/thumbnail/fullpage/%s/%s/%s',
					$this->domain_id,
					$this->url_id,
					$this->screenshot_date
				);

			case 'carousel-thumbnail':
				return sprintf(
					'https://www.urlslab.com/public/thumbnail/carousel/%s/%s/%s',
					$this->domain_id,
					$this->url_id,
					$this->screenshot_date
				);

			case 'full-page':
				return sprintf(
					'https://www.urlslab.com/public/image/%s/%s/%s',
					$this->domain_id,
					$this->url_id,
					$this->screenshot_date
				);

			case 'carousel':
			default:
				return sprintf(
					'https://www.urlslab.com/public/carousel/%s/%s/%s',
					$this->domain_id,
					$this->url_id,
					$this->screenshot_date
				);
		}
	}

	/**
	 * @return string
	 */
	public function get_url_summary_text( $strategy ): string {

		switch ( $strategy ) {

			case Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY: //# phpcs:ignore
				if ( ! empty( $this->url_summary ) && trim( $this->url_summary ) !== '' ) {
					return $this->url_summary;
				}
			case Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION: //# phpcs:ignore
				if ( trim( $this->get_url_meta_description() ) !== '' ) {
					return $this->get_url_meta_description();
				}
			case Urlslab_Link_Enhancer::DESC_TEXT_TITLE: //# phpcs:ignore
				if ( trim( $this->get_url_title() ) !== '' ) {
					return $this->get_url_title();
				}
			case Urlslab_Link_Enhancer::DESC_TEXT_URL:
			default:
				return ucwords(
					trim(
						trim(
							trim(
								str_replace(
									'/',
									' - ',
									str_replace(
										array( '-', '_', '+' ),
										' ',
										$this->url->get_url_path()
									)
								)
							),
							'-'
						)
					)
				);
		}


	}

	public function get_visibility() {
		return $this->visibility;
	}

}
