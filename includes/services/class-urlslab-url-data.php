<?php

class Urlslab_Url_Data {
	private $domain_id;
	private $url_id;

	private Urlslab_Url $url;
	private $screenshot_date;
	private ?string $url_title;
	private ?string $url_meta_description;
	private ?string $url_summary;
	private ?string $screenshot_status;

	/**
	 * @param Urlslab_Url $url
	 * @param $domain_id
	 * @param $url_id
	 * @param $screenshot_date
	 * @param $url_title
	 * @param $url_meta_description
	 * @param $url_summary
	 * @param $screenshot_status
	 */
	public function __construct(
		Urlslab_Url $url,
		$domain_id,
		$url_id,
		$screenshot_date,
		$url_title,
		$url_meta_description,
		$url_summary,
		$screenshot_status
	) {
		$this->url                  = $url;
		$this->domain_id            = $domain_id;
		$this->url_id               = $url_id;
		$this->screenshot_date      = $screenshot_date;
		$this->url_title            = $url_title;
		$this->url_meta_description = $url_meta_description;
		$this->url_summary          = $url_summary;
		$this->screenshot_status    = $screenshot_status;
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
		return $this->url_title;
	}

	/**
	 * @return string
	 */
	public function get_url_meta_description(): string {
		return $this->url_meta_description;
	}

	/**
	 * @return string
	 */
	public function get_url_summary(): string {
		return $this->url_summary;
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

	/**
	 * @param $screenshot_type
	 *
	 * @return string
	 */
	public function render_screenshot_path( $screenshot_type = 'carousel' ): string {
		switch ( $screenshot_type ) {
			case 'thumbnail':
				return sprintf(
					'https://www.urlslab.com/public/thumbnail/%s/%s/%s.jpg',
					$this->domain_id,
					$this->url_id,
					$this->screenshot_date
				);
			case 'full-page':
				return sprintf(
					'https://www.urlslab.com/public/image/%s/%s/%s.png',
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
	public function get_url_summary_text(): string {
		if ( strlen( trim( $this->url_summary ) ) ) {
			return $this->url_summary;
		} elseif ( strlen( trim( $this->url_meta_description ) ) ) {
			return $this->url_meta_description;
		} elseif ( strlen( trim( $this->url_title ) ) ) {
			return $this->url_title;
		}

		return ucwords(trim(trim(trim(
			str_replace(
				'/',
				' - ',
				str_replace(['-', '_', '+'], ' ', $this->url->get_url_path())
			)
		), '-')));
	}


}
