<?php

class Urlslab_Data_Url extends Urlslab_Data {
	public const URL_TYPE_INTERNAL = 'I';
	public const URL_TYPE_EXTERNAL = 'E';

	public const VALUE_EMPTY = 'E';

	public const HTTP_STATUS_NOT_PROCESSED = - 1;
	public const HTTP_STATUS_PENDING = - 2;
	public const HTTP_STATUS_OK = 200;
	public const HTTP_STATUS_CLIENT_ERROR = 400;

	public const SCR_STATUS_ERROR = 'E';
	public const SCR_STATUS_NEW = 'N';
	public const SCR_STATUS_PENDING = 'P';
	public const SCR_STATUS_UPDATING = 'U';
	public const SCR_STATUS_ACTIVE = 'A';

	public const SUM_STATUS_ERROR = 'E';
	public const SUM_STATUS_NEW = 'N';
	public const SUM_STATUS_PENDING = 'P';
	public const SUM_STATUS_UPDATING = 'U';
	public const SUM_STATUS_ACTIVE = 'A';

	public const VISIBILITY_VISIBLE = 'V';
	public const VISIBILITY_HIDDEN = 'H';


	public const SCREENSHOT_TYPE_CAROUSEL = 'carousel';
	public const SCREENSHOT_TYPE_FULL_PAGE = 'full-page';
	public const SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL = 'carousel-thumbnail';
	public const SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL = 'full-page-thumbnail';

	//related resources schedule
	public const REL_NOT_REQUESTED_SCHEDULE = '';
	public const REL_SCHEDULE_NEW = 'N';          //waiting to be scheduled to urlslab
	public const REL_SCHEDULE_SCHEDULED = 'S';    //pending processing in urlslab
	public const REL_AVAILABLE = 'A';
	public const REL_ERROR = 'E';
	const REL_MANUAL = 'M';

	/**
	 * @param array $url
	 */
	public function __construct(
		array $url = array(),
		$loaded_from_db = true
	) {
		$this->set_url_id( $url['url_id'] ?? 0, $loaded_from_db );
		$this->set_final_url_id( $url['final_url_id'] ?? $this->get_url_id(), $loaded_from_db );
		$this->set_url_name( $url['url_name'] ?? '', $loaded_from_db );
		$this->set_url_priority( $url['url_priority'] ?? $this->compute_default_url_priority(), $loaded_from_db );
		$this->set_scr_status( $url['scr_status'] ?? '', $loaded_from_db );
		$this->set_sum_status( $url['sum_status'] ?? '', $loaded_from_db );
		$this->set_http_status( $url['http_status'] ?? self::HTTP_STATUS_NOT_PROCESSED, $loaded_from_db );
		$this->set_urlslab_domain_id( $url['urlslab_domain_id'] ?? '', $loaded_from_db );
		$this->set_urlslab_url_id( $url['urlslab_url_id'] ?? '', $loaded_from_db );
		$this->set_urlslab_scr_timestamp( $url['urlslab_scr_timestamp'] ?? 0, $loaded_from_db );
		$this->set_urlslab_sum_timestamp( $url['urlslab_sum_timestamp'] ?? 0, $loaded_from_db );
		$this->set_update_scr_date( $url['update_scr_date'] ?? Urlslab_Data::get_now(), $loaded_from_db );
		$this->set_update_sum_date( $url['update_sum_date'] ?? Urlslab_Data::get_now(), $loaded_from_db );
		$this->set_update_http_date( $url['update_http_date'] ?? Urlslab_Data::get_now(), $loaded_from_db );
		$this->set_url_title( $url['url_title'] ?? '', $loaded_from_db );
		$this->set_url_h1( $url['url_h1'] ?? '', $loaded_from_db );
		$this->set_url_lang( $url['url_lang'] ?? '', $loaded_from_db );
		$this->set_url_meta_description( $url['url_meta_description'] ?? '', $loaded_from_db );
		$this->set_url_summary( $url['url_summary'] ?? '', $loaded_from_db );
		$this->set_visibility( $url['visibility'] ?? self::VISIBILITY_VISIBLE, $loaded_from_db );
		$this->set_rel_schedule( $url['rel_schedule'] ?? self::REL_NOT_REQUESTED_SCHEDULE, $loaded_from_db );
		$this->set_rel_updated( $url['rel_updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_labels( $url['labels'] ?? '', $loaded_from_db );
		$this->set_attributes( $url['attributes'] ?? '', $loaded_from_db );

		$url_type = self::URL_TYPE_INTERNAL;
		if ( isset( $url['url_type'] ) ) {
			$url_type = $url['url_type'];
		} else {
			if ( strlen( $this->get_url_name() ) ) {
				try {
					$url_type = $this->get_url()->is_same_domain_url() ? self::URL_TYPE_INTERNAL : self::URL_TYPE_EXTERNAL;
				} catch ( Exception $e ) {
				}
			}
		}
		$this->set_url_type( $url_type, $loaded_from_db );
		$this->set_url_usage_cnt( $url['url_usage_cnt'] ?? 0, $loaded_from_db );
		$this->set_url_links_count( $url['url_links_count'] ?? 0, $loaded_from_db );
		$this->set_screenshot_usage_count( $url['screenshot_usage_count'] ?? 0, $loaded_from_db );
		$this->set_post_id( $url['post_id'] ?? 0, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id' );
	}

	public function get_url(): Urlslab_Url {
		return new Urlslab_Url( $this->get_url_name(), true );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_final_url_id(): int {
		return $this->get( 'final_url_id' );
	}

	public function get_url_name(): string {
		return $this->get( 'url_name' );
	}

	public function get_scr_status(): string {
		return $this->get( 'scr_status' );
	}

	public function get_sum_status(): string {
		return $this->get( 'sum_status' );
	}

	public function get_http_status(): int {
		return $this->get( 'http_status' );
	}

	public function get_url_priority(): int {
		return $this->get( 'url_priority' );
	}

	public function set_url_priority( int $url_priority, bool $loaded_from_db = false ): void {
		$this->set( 'url_priority', $url_priority, $loaded_from_db );
	}

	public function is_http_redirect(): bool {
		return $this->get_http_status() >= 300 && $this->get_http_status() < 400 && $this->get_url_id() !== $this->get_final_url_id();
	}

	public function get_urlslab_domain_id(): string {
		return $this->get( 'urlslab_domain_id' );
	}

	public function get_urlslab_url_id(): string {
		return $this->get( 'urlslab_url_id' );
	}

	public function get_urlslab_scr_timestamp(): int {
		return $this->get( 'urlslab_scr_timestamp' );
	}

	public function get_urlslab_sum_timestamp(): int {
		return $this->get( 'urlslab_sum_timestamp' );
	}

	public function get_update_scr_date(): string {
		return $this->get( 'update_scr_date' );
	}

	public function get_update_sum_date(): string {
		return $this->get( 'update_sum_date' );
	}

	public function get_update_http_date(): string {
		return $this->get( 'update_http_date' );
	}

	public function get_rel_schedule(): string {
		return $this->get( 'rel_schedule' );
	}

	public function get_rel_updated(): string {
		return $this->get( 'rel_updated' );
	}

	public function get_url_title(): string {
		return $this->get( 'url_title' );
	}

	public function get_url_h1(): string {
		return $this->get( 'url_h1' );
	}

	public function get_url_lang(): string {
		return $this->get( 'url_lang' );
	}

	public function get_url_meta_description(): string {
		return $this->get( 'url_meta_description' );
	}

	public function get_url_summary(): string {
		return $this->get( 'url_summary' );
	}

	public function get_post_id(): int {
		return $this->get( 'post_id' );
	}

	public function set_post_id( int $post_id, $loaded_from_db = false ): void {
		$this->set( 'post_id', $post_id, $loaded_from_db );
	}

	protected function get( $name ) {
		switch ( $name ) {
			case 'url_summary':
			case 'url_title':
			case 'url_h1':
			case 'url_meta_description':
				if ( Urlslab_Data_Url::VALUE_EMPTY === $this->data[ $name ] ) {
					return '';
				} //continue to default case if value is not EMPTY
			default:
				return parent::get( $name );
		}
	}

	public function get_visibility(): string {
		return $this->get( 'visibility' );
	}

	public function get_url_type(): string {
		return $this->get( 'url_type' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_final_url_id( int $final_url_id, $loaded_from_db = false ): void {
		$this->set( 'final_url_id', $final_url_id, $loaded_from_db );
	}

	public function set_url_name( string $url_name, $loaded_from_db = false ): void {
		$this->set( 'url_name', $url_name, $loaded_from_db );
	}

	public function set_scr_status( string $scr_status, $loaded_from_db = false ): void {
		$this->set( 'scr_status', $scr_status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_update_scr_date( self::get_now() );
		}
	}

	public function set_sum_status( string $sum_status, $loaded_from_db = false ): void {
		$this->set( 'sum_status', $sum_status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_update_sum_date( self::get_now() );
		}
	}

	public function set_http_status( int $http_status, $loaded_from_db = false ): void {
		$this->set( 'http_status', $http_status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_update_http_date( self::get_now() );
		}
	}

	public function set_urlslab_domain_id( string $urlslab_domain_id, $loaded_from_db = false ): void {
		$this->set( 'urlslab_domain_id', $urlslab_domain_id, $loaded_from_db );
	}

	public function set_urlslab_url_id( string $urlslab_url_id, $loaded_from_db = false ): void {
		$this->set( 'urlslab_url_id', $urlslab_url_id, $loaded_from_db );
	}

	public function set_urlslab_scr_timestamp( int $urlslab_scr_timestamp, $loaded_from_db = false ): void {
		$this->set( 'urlslab_scr_timestamp', $urlslab_scr_timestamp, $loaded_from_db );
	}

	public function set_urlslab_sum_timestamp( int $urlslab_sum_timestamp, $loaded_from_db = false ): void {
		$this->set( 'urlslab_sum_timestamp', $urlslab_sum_timestamp, $loaded_from_db );
	}

	public function set_update_scr_date( string $update_scr_date, $loaded_from_db = false ): void {
		$this->set( 'update_scr_date', $update_scr_date, $loaded_from_db );
	}

	public function set_update_sum_date( string $update_sum_date, $loaded_from_db = false ): void {
		$this->set( 'update_sum_date', $update_sum_date, $loaded_from_db );
	}

	public function set_update_http_date( string $update_http_date, $loaded_from_db = false ): void {
		$this->set( 'update_http_date', $update_http_date, $loaded_from_db );
	}

	public function set_url_title( string $url_title, $loaded_from_db = false ): void {
		$this->set( 'url_title', $url_title, $loaded_from_db );
	}

	public function set_url_h1( string $url_h1, $loaded_from_db = false ): void {
		$this->set( 'url_h1', $url_h1, $loaded_from_db );
	}

	public function set_url_lang( string $url_lang, $loaded_from_db = false ): void {
		$this->set( 'url_lang', $url_lang, $loaded_from_db );
	}


	public function set_url_meta_description( string $url_meta_description, $loaded_from_db = false ): void {
		$this->set( 'url_meta_description', $url_meta_description, $loaded_from_db );
	}

	public function set_url_summary( string $url_summary, $loaded_from_db = false ): void {
		$this->set( 'url_summary', $url_summary, $loaded_from_db );
	}

	public function set_visibility( string $visibility, $loaded_from_db = false ): void {
		$this->set( 'visibility', $visibility, $loaded_from_db );
	}

	public function set_url_type( string $url_type, $loaded_from_db = false ): void {
		$this->set( 'url_type', $url_type, $loaded_from_db );
	}

	public function set_rel_schedule( string $rel_schedule, $loaded_from_db = false ): void {
		$this->set( 'rel_schedule', $rel_schedule, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_rel_updated( self::get_now() );
		}
	}

	public function set_rel_updated( string $rel_updated, $loaded_from_db = false ): void {
		$this->set( 'rel_updated', $rel_updated, $loaded_from_db );
	}


	public function get_labels(): array {
		return $this->get( 'labels' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_url_usage_cnt(): int {
		return $this->get( 'url_usage_cnt' );
	}

	public function get_url_links_count(): int {
		return $this->get( 'url_links_count' );
	}

	public function get_screenshot_usage_count(): int {
		return $this->get( 'screenshot_usage_count' );
	}

	public function set_url_usage_cnt( int $url_usage_cnt, $loaded_from_db = false ): void {
		$this->set( 'url_usage_cnt', $url_usage_cnt, $loaded_from_db );
	}

	public function set_url_links_count( int $url_links_count, $loaded_from_db = false ): void {
		$this->set( 'url_links_count', $url_links_count, $loaded_from_db );
	}

	public function set_screenshot_usage_count( int $screenshot_usage_count, $loaded_from_db = false ): void {
		$this->set( 'screenshot_usage_count', $screenshot_usage_count, $loaded_from_db );
	}

	public function get_attributes(): string {
		return $this->get( 'attributes' );
	}

	public function set_attributes( $attributes, $loaded_from_db = false ): void {
		$this->set( 'attributes', trim( $attributes ), $loaded_from_db );
	}

	public function get_summary_text( $strategy ): string {
		switch ( $strategy ) {
			case Urlslab_Widget_Urls::DESC_TEXT_SUMMARY:
				if ( ! empty( trim( $this->get_url_summary() ) ) ) {
					return trim( $this->get_url_summary() );
				}
				if ( empty( $this->get_sum_status() ) ) {
					$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Urls::SLUG );
					if (
						$widget &&
						(
							$this->is_internal() && $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS ) ||
							! $this->is_internal() && $widget->get_option( Urlslab_Widget_Urls::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS )
						)
					) {
						$this->set_sum_status( self::SUM_STATUS_NEW );
						$this->update();
					}
				} //continue to next option
			case Urlslab_Widget_Urls::DESC_TEXT_META_DESCRIPTION:
				if ( ! empty( trim( $this->get_url_meta_description() ) ) ) {
					return trim( $this->get_url_meta_description() );
				} //continue to next option
			case Urlslab_Widget_Urls::DESC_TEXT_TITLE:
				if ( ! empty( trim( $this->get_url_title() ) ) ) {
					return trim( $this->get_url_title() );
				}
				if ( ! empty( trim( $this->get_url_h1() ) ) ) {
					return trim( $this->get_url_h1() );
				} //continue to next option
			case Urlslab_Widget_Urls::DESC_TEXT_H1:
				if ( ! empty( trim( $this->get_url_h1() ) ) ) {
					return trim( $this->get_url_h1() );
				}
				if ( ! empty( trim( $this->get_url_title() ) ) ) {
					return trim( $this->get_url_title() );
				} //continue to next option
			case Urlslab_Widget_Urls::DESC_TEXT_URL:
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
	public function get_screenshot_url( string $screenshot_type = self::SCREENSHOT_TYPE_CAROUSEL, $schedule = false ): string {
		if ( ! $this->has_screenshot() ) {
			if ( $schedule ) {
				$this->init_scr_status_shortcode();
				$this->update();
			}

			return '';
		}

		return self::get_screenshot_image_url(
			$this->get_urlslab_domain_id(),
			$this->get_urlslab_url_id(),
			$this->get_urlslab_scr_timestamp(),
			$screenshot_type
		);
	}

	public static function get_screenshot_image_url( string $domain_id, string $url_id, $screenshot_id, string $screenshot_type ): string {
		switch ( $screenshot_type ) {
			case Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE_THUMBNAIL:
				$path = 'https://api.urlslab.com/v1/public/screenshot/thumbnail/fullpage/%s/%s/%s';
				break;
			case Urlslab_Data_Url::SCREENSHOT_TYPE_CAROUSEL_THUMBNAIL:
				$path = 'https://api.urlslab.com/v1/public/screenshot/thumbnail/carousel/%s/%s/%s';
				break;
			case Urlslab_Data_Url::SCREENSHOT_TYPE_FULL_PAGE:
				$path = 'https://api.urlslab.com/v1/public/screenshot/fullpage/%s/%s/%s';
				break;
			case Urlslab_Data_Url::SCREENSHOT_TYPE_CAROUSEL:
			default:
				$path = 'https://api.urlslab.com/v1/public/screenshot/carousel/%s/%s/%s';
				break;
		}

		return sprintf(
			$path,
			$domain_id,
			$url_id,
			$screenshot_id
		);
	}

	public function has_screenshot(): bool {
		return ! empty( $this->get_urlslab_scr_timestamp() ) && ! empty( $this->get_urlslab_domain_id() ) && ! empty( $this->get_urlslab_url_id() );
	}

	/**
	 * Valid are URLs, which were not processed yet or have status 200
	 *
	 * @return bool
	 */
	public function is_http_valid() {
		return ( 400 > $this->get_http_status() || 429 == $this->get_http_status() || 403 == $this->get_http_status() ) && $this->is_visible();
	}

	public function is_internal() {
		return self::URL_TYPE_INTERNAL === $this->get_url_type();
	}

	public function is_visible() {
		return self::VISIBILITY_HIDDEN != $this->get_visibility();
	}


	public function init_scr_status_import() {
		if ( ! empty( $this->get_scr_status() ) ) {
			return false;
		}
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_General::SLUG ) ) {
			switch ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_SHEDULE_SCRRENSHOT ) ) {
				case Urlslab_Widget_General::SCHEDULE_ALL:
					break;
				case Urlslab_Widget_General::SCHEDULE_ALL_INTERNALS:
					if ( ! $this->is_internal() ) {
						return false;
					}
					break;
				default:
					return false;
			}
			$this->set_scr_status( self::SCR_STATUS_NEW );
		}
	}

	public function init_scr_status_shortcode() {
		if ( ! empty( $this->get_scr_status() ) ) {
			return false;
		}
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_General::SLUG ) ) {
			switch ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_SHEDULE_SCRRENSHOT ) ) {
				case Urlslab_Widget_General::SCHEDULE_ALL:
				case Urlslab_Widget_General::SCHEDULE_SHORTCODE:
					break;
				case Urlslab_Widget_General::SCHEDULE_ALL_INTERNALS:
					if ( ! $this->is_internal() ) {
						return false;
					}
					break;
				default:
					return false;
			}
			$this->set_scr_status( self::SCR_STATUS_NEW );
		}
	}

	/**
	 * @param Urlslab_Url[] $urls
	 *
	 * @return void
	 */
	public function insert_urls( $urls, $scr_status = false, $sum_status = '', $http_status = self::HTTP_STATUS_NOT_PROCESSED, $rel_schedule = self::REL_NOT_REQUESTED_SCHEDULE ): bool {
		if ( empty( $urls ) ) {
			return true;
		}

		$rows = array();

		foreach ( $urls as $url ) {
			$url_obj = new Urlslab_Data_Url(
				array(
					'url_id'       => $url->get_url_id(),
					'url_name'     => $url->get_url(),
					'sum_status'   => $sum_status,
					'rel_schedule' => $rel_schedule,
					'rel_updated'  => self::get_now(),
					'http_status'  => $http_status,
					'url_type'     => $url->is_same_domain_url() ? self::URL_TYPE_INTERNAL : self::URL_TYPE_EXTERNAL,
				),
				false
			);
			if ( $scr_status ) {
				$url_obj->set_scr_status( $scr_status );
			} else {
				$url_obj->init_scr_status_import();
			}
			$rows[] = $url_obj;
		}

		$result = $this->insert_all( $rows, true );

		return is_numeric( $result );
	}

	public function request_rel_schedule() {
		if ( empty( $this->get_rel_schedule() ) ) {
			if ( $this->get_url()->is_blacklisted() ) {
				$this->set_rel_schedule( Urlslab_Data_Url::REL_ERROR );
			} else {
				$this->set_rel_schedule( Urlslab_Data_Url::REL_SCHEDULE_NEW );
			}
			$this->update();
		}
	}

	public function get_domain_name(): string {
		return $this->get_url()->get_domain_name();
	}

	private function compute_default_url_priority(): int {
		$priority = 30;
		if ( strlen( $this->get_url_name() ) ) {
			$path     = trim( $this->get_url()->get_url_path(), '/' );
			$priority = strlen( $path ) - strlen( str_replace( '/', '', $path ) );
			if ( 0 === $priority ) {
				$priority = 1;
			}
		}

		if ( 100 < $priority ) {
			$priority = 100;
		}

		return $priority;
	}


	public static function update_url_usage_count( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT dest_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' GROUP by dest_url_id ) as c ON u.url_id=c.dest_url_id SET u.url_usage_cnt=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT dest_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE dest_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by dest_url_id ) as c ON u.url_id=c.dest_url_id SET u.url_usage_cnt=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}


	public static function update_url_links_count( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT src_url_id, count(dest_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' GROUP by src_url_id ) as c ON u.url_id=c.src_url_id SET u.url_links_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT src_url_id, count(dest_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE src_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by src_url_id ) as c ON u.url_id=c.src_url_id SET u.url_links_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}

	public static function update_screenshot_usage_count( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT screenshot_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_SCREENSHOT_URLS_TABLE . ' GROUP by screenshot_url_id ) as c ON u.url_id=c.screenshot_url_id SET u.screenshot_usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT screenshot_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_SCREENSHOT_URLS_TABLE . ' WHERE screenshot_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by screenshot_url_id ) as c ON u.url_id=c.screenshot_url_id SET u.screenshot_usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}


	public function update_http_response(): bool {
		try {

			if ( ! $this->get_url()->is_url_valid() ) {
				$this->set_http_status( Urlslab_Data_Url::HTTP_STATUS_CLIENT_ERROR );
				$this->update();
				$this->set_empty();

				return true;
			}

			if ( $this->get_url()->is_blacklisted() ) {
				$this->set_http_status( Urlslab_Data_Url::HTTP_STATUS_OK );
				$this->update();
				$this->set_empty();

				return true;
			}

			if ( ! strlen( trim( $this->get_url_title() ) ) ) {
				$this->set_url_title( Urlslab_Data_Url::VALUE_EMPTY );
			}
			if ( ! strlen( trim( $this->get_url_h1() ) ) ) {
				$this->set_url_h1( Urlslab_Data_Url::VALUE_EMPTY );
			}
			if ( ! strlen( trim( $this->get_url_meta_description() ) ) ) {
				$this->set_url_meta_description( Urlslab_Data_Url::VALUE_EMPTY );
			}
			$this->set_http_status( Urlslab_Data_Url::HTTP_STATUS_PENDING );
			$this->update();    // lock the entry, so no other process will start working on it

			$results = $this->get_url()->download_url();

			if ( isset( $results['url'] ) ) {
				try {
					$final_url = new Urlslab_Url( $results['url'], true );
				} catch ( Exception $e ) {
					$final_url = $this->get_url();
				}
			} else {
				$final_url = $this->get_url();
			}

			$this->set_final_url_id( $final_url->get_url_id() );

			$this->set_attributes( '' );

			if ( Urlslab_Data_Url::HTTP_STATUS_OK === $results['status_code'] ) {
				if ( $final_url->get_url_id() != $this->get_url_id() ) {
					$this->set_http_status( $results['first_status_code'] );
					if ( 300 < $results['first_status_code'] && 399 > $results['first_status_code'] ) {
						$url_row_obj = new Urlslab_Data_Url();
						$url_row_obj->insert_urls( array( $final_url ) );
					}
				} else {
					$this->set_http_status( $results['status_code'] );
				}

				$this->extract_data_from_http_headers( $results['headers'] );

				if ( ! empty( $results['body'] ) ) {
					$content_type = is_array( $results['headers']['content-type'] ) ? implode( '; ', $results['headers']['content-type'] ) : $results['headers']['content-type'];
					if ( false !== strpos( $content_type, 'text/html' ) ) {
						$this->extract_data_from_html_document( $results['body'] );
					} else {
						$this->set_empty();
					}
				} else {
					$this->set_empty();
				}
			} else if ( 429 == $results['status_code'] ) {
				$this->set_http_status( Urlslab_Data_Url::HTTP_STATUS_PENDING );    //rate limit hit, process later
			} else {
				$this->set_http_status( $results['status_code'] );
				$this->set_empty();
			}
		} catch ( Exception $e ) {
			$this->set_empty();
		}

		return $this->update();
	}

	private function set_empty() {
		$this->set_url_title( Urlslab_Data_Url::VALUE_EMPTY );
		$this->set_url_h1( Urlslab_Data_Url::VALUE_EMPTY );
		$this->set_url_meta_description( Urlslab_Data_Url::VALUE_EMPTY );
		$this->set_url_lang( Urlslab_Data_Url::VALUE_EMPTY );

		if (
			Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Link_Builder::SLUG ) &&
			Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Link_Builder::SLUG )->get_option( Urlslab_Widget_Link_Builder::SETTING_NAME_BACKLINK_MONITORING )
		) {
			global $wpdb;
			$wpdb->update( URLSLAB_BACKLINK_MONITORS_TABLE, array( 'status' => Urlslab_Data_Backlink_Monitor::STATUS_MISSING ), array( 'from_url_id' => $this->get_url_id() ), array( '%d' ) ); // phpcs:ignore
		}
	}

	/**
	 * @param $body
	 *
	 * @return void
	 */
	private function extract_data_from_html_document( $body ): void {
		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = 'utf-8';
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );
		$document->loadHTML( mb_convert_encoding( $body, 'HTML-ENTITIES', 'utf-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE | LIBXML_NOWARNING );
		libxml_clear_errors();
		libxml_use_internal_errors( $libxml_previous_state );

		$html_title = $this->get_text_from_tag( 'title', $document );
		if ( ! empty( $html_title ) ) {
			$this->set_url_title( $html_title );
		}
		if ( empty( $this->get_url_title() ) ) {
			$this->set_url_title( Urlslab_Data_Url::VALUE_EMPTY );
		}

		$h1 = $this->get_text_from_tag( 'h1', $document );
		if ( ! empty( $h1 ) ) {
			$this->set_url_h1( $h1 );
		}
		if ( empty( $this->get_url_h1() ) ) {
			$this->set_url_h1( Urlslab_Data_Url::VALUE_EMPTY );
		}

		$xpath = new DOMXPath( $document );

		$html_tag = $xpath->query( '//html' );
		if ( 0 === $html_tag->length ) {
			$this->set_url_lang( Urlslab_Data_Url::VALUE_EMPTY );
		} else {
			foreach ( $html_tag as $tag ) {
				if ( $tag->hasAttribute( 'lang' ) && strlen( $tag->getAttribute( 'lang' ) ) ) {
					$this->set_url_lang( $tag->getAttribute( 'lang' ) );
					break;
				} else {
					$this->set_url_lang( Urlslab_Data_Url::VALUE_EMPTY );
					break;
				}
			}
		}

		$metadescriptions = $xpath->evaluate( '//meta[@name="description"]/@content' );
		if ( $metadescriptions->length > 0 ) {
			$this->set_url_meta_description( $metadescriptions->item( 0 )->value );
		}
		if ( empty( $this->get_url_meta_description() ) ) {
			$this->set_url_meta_description( Urlslab_Data_Url::VALUE_EMPTY );
		}
		if ( empty( $this->get_url_lang() ) || Urlslab_Data_Url::VALUE_EMPTY == $this->get_url_lang() ) {
			$xpath     = new DOMXPath( $document );
			$languages = $xpath->evaluate( '//meta[@http-equiv="Content-Language"]/@content' );
			if ( $languages->length > 0 ) {
				$this->set_url_lang( $languages->item( 0 )->value );
			}
		}

		$robots = $xpath->evaluate( '//meta[@name="robots"]/@content' );
		foreach ( $robots as $robot ) {
			$robot_values = explode( ',', $robot->value );
			foreach ( $robot_values as $robot_value ) {
				$this->add_attribute( $robot_value );
			}
		}
		$googlebots = $xpath->evaluate( '//meta[@name="googlebot"]/@content' );
		foreach ( $googlebots as $googlebot ) {
			$this->add_attribute( $googlebot->value );
		}


		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Link_Builder::SLUG ) && Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Link_Builder::SLUG )->get_option( Urlslab_Widget_Link_Builder::SETTING_NAME_BACKLINK_MONITORING ) ) {
			$this->update_backlinks( $document );
		}
	}

	private function get_text_from_tag( $tag_name, DOMDocument $document ) {
		$xpath = new DOMXPath( $document );
		$nodes = $xpath->query( '//' . $tag_name );
		if ( ! empty( $nodes ) ) {
			foreach ( $nodes as $node ) {
				return $node->textContent; //phpcs:ignore
			}
		}

		return '';
	}

	private function update_backlinks( DOMDocument $document ) {
		global $wpdb;

		$results = $wpdb->get_results( $wpdb->prepare( 'SELECT b.*, u.url_name as to_url_name FROM ' . URLSLAB_BACKLINK_MONITORS_TABLE . ' b INNER JOIN ' . URLSLAB_URLS_TABLE . ' u ON b.to_url_id=u.url_id WHERE from_url_id=%d', $this->get_url_id() ), ARRAY_A ); // phpcs:ignore
		if ( ! empty( $results ) ) {
			$domains = array();
			$xpath   = new DOMXPath( $document );
			$nodes   = $xpath->query( '//a' ); //phpcs:ignore
			foreach ( $nodes as $node ) {
				if ( $node->hasAttribute( 'href' ) ) {
					try {
						$href = $node->getAttribute( 'href' );
						if ( empty( $href ) ) {
							continue;
						}

						if ( false !== strpos( $href, 'http' ) ) {
							$url = new Urlslab_Url( $href, true );
						} else {
							$url = new Urlslab_Url( $this->get_url()->get_domain_name() . '/' . ltrim( $href, '/' ), true );
						}

						$domains[ $url->get_domain_id() ][ $url->get_url_id() ] = $node; //phpcs:ignore
					} catch ( Exception $e ) {
						continue;
					}
				}
			}

			foreach ( $results as $row ) {
				$backlink_obj = new Urlslab_Data_Backlink_Monitor( $row );
				$backlink_obj->set_updated( Urlslab_Data::get_now() );
				try {
					$url = new Urlslab_Url( $row['to_url_name'], true );

					$url2 = new Urlslab_Url( rtrim( $row['to_url_name'], '/' ), true );

					if ( isset( $domains[ $url->get_domain_id() ] ) ) {
						if ( $url->get_domain_id() == $url->get_url_id() || isset( $domains[ $url->get_domain_id() ][ $url->get_url_id() ] ) || isset( $domains[ $url->get_domain_id() ][ $url2->get_url_id() ] ) ) {
							$backlink_obj->set_status( Urlslab_Data_Backlink_Monitor::STATUS_OK );
							if ( empty( $backlink_obj->get_first_seen() ) || '0000-00-00 00:00:00' === $backlink_obj->get_first_seen() ) {
								$backlink_obj->set_first_seen( Urlslab_Data::get_now() );
							}
							$backlink_obj->set_last_seen( Urlslab_Data::get_now() );
							if ( isset( $domains[ $url->get_domain_id() ][ $url->get_url_id() ] ) ) {
								$backlink_obj->set_anchor_text( trim( $domains[ $url->get_domain_id() ][ $url->get_url_id() ]->textContent ) );// phpcs:ignore
							} else if ( isset( $domains[ $url->get_domain_id() ][ $url2->get_url_id() ] ) ) {
								$backlink_obj->set_anchor_text( trim( $domains[ $url->get_domain_id() ][ $url2->get_url_id() ]->textContent ) );// phpcs:ignore
							} else {
								foreach ( $domains[ $url->get_domain_id() ] as $node ) {
									$backlink_obj->set_anchor_text( trim( $node->textContent ) );// phpcs:ignore
									$backlink_obj->set_link_attributes( ( $node->hasAttribute( 'rel' ) ? $node->getAttribute( 'rel' ) : '' ) . ' ' . ( $node->hasAttribute( 'referrerpolicy' ) ? $node->getAttribute( 'referrerpolicy' ) : '' ) );// phpcs:ignore
									break;
								}
							}
						} else {
							$backlink_obj->set_status( Urlslab_Data_Backlink_Monitor::STATUS_MISSING );
						}
					} else {
						$backlink_obj->set_status( Urlslab_Data_Backlink_Monitor::STATUS_MISSING );
					}
				} catch ( Exception $e ) {
					$backlink_obj->set_status( Urlslab_Data_Backlink_Monitor::STATUS_MISSING );
				}

				//Update url map
				if ( Urlslab_Data_Backlink_Monitor::STATUS_MISSING === $backlink_obj->get_status() ) {
					$wpdb->delete(
						URLSLAB_URLS_MAP_TABLE,
						array(
							'src_url_id'  => $backlink_obj->get_from_url_id(),
							'dest_url_id' => $backlink_obj->get_to_url_id(),
						)
					);
				} else if ( Urlslab_Data_Backlink_Monitor::STATUS_OK === $backlink_obj->get_status() ) {
					$obj_url_map = new Urlslab_Data_Url_Map(
						array(
							'src_url_id'  => $backlink_obj->get_from_url_id(),
							'dest_url_id' => $backlink_obj->get_to_url_id(),
						),
						false
					);
					$obj_url_map->insert_all( array( $obj_url_map ), true );
				}

				$backlink_obj->update();
			}
		}
	}

	private function extract_data_from_http_headers( $headers ) {
		if ( is_array( $headers ) ) {
			foreach ( $headers as $header => $header_value ) {
				if ( 'x-robots-tag' === $header ) {
					$this->add_attribute( $header_value );
				}
			}
		}
	}

	private function add_attribute( string $attribute ) {
		$attribute = trim( $attribute );
		if ( empty( $attribute ) || 'index' === $attribute || 'follow' === $attribute ) {
			return;
		}
		if ( false === strpos( $this->get_attributes(), $attribute ) ) {
			if ( strlen( $this->get_attributes() ) ) {
				$attribute = ', ' . $attribute;
			}
			$this->set_attributes( $this->get_attributes() . $attribute );
		}
	}

	public function get_columns(): array {
		return array(
			'url_id'                 => '%d',
			'final_url_id'           => '%d',
			'url_name'               => '%s',
			'scr_status'             => '%s',
			'sum_status'             => '%s',
			'http_status'            => '%d',
			'urlslab_domain_id'      => '%s',
			'urlslab_url_id'         => '%s',
			'update_sum_date'        => '%s',
			'update_scr_date'        => '%s',
			'update_http_date'       => '%s',
			'urlslab_scr_timestamp'  => '%d',
			'urlslab_sum_timestamp'  => '%d',
			'url_title'              => '%s',
			'url_h1'                 => '%s',
			'url_lang'               => '%s',
			'url_meta_description'   => '%s',
			'url_summary'            => '%s',
			'url_priority'           => '%d',
			'visibility'             => '%s',
			'url_type'               => '%s',
			'rel_schedule'           => '%s',
			'rel_updated'            => '%s',
			'labels'                 => '%s',
			'url_usage_cnt'          => '%d',
			'screenshot_usage_count' => '%d',
			'url_links_count'        => '%d',
			'attributes'             => '%s',
			'post_id'                => '%d',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'update_sum_date':
			case 'update_scr_date':
			case 'update_http_date':
			case 'rel_updated':
				return self::COLUMN_TYPE_DATE;
			case 'scr_status':
			case 'sum_status':
			case 'visibility':
			case 'rel_schedule':
				return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'scr_status':
				return array(
					''                        => __( 'Not Requested', 'urlslab' ),
					self::SCR_STATUS_ACTIVE   => __( 'Done', 'urlslab' ),
					self::SCR_STATUS_NEW      => __( 'Waiting', 'urlslab' ),
					self::SCR_STATUS_ERROR    => __( 'Error', 'urlslab' ),
					self::SCR_STATUS_PENDING  => __( 'Pending', 'urlslab' ),
					self::SCR_STATUS_UPDATING => __( 'Updating', 'urlslab' ),
				);
			case 'sum_status':
				return array(
					''                        => __( 'Not Requested', 'urlslab' ),
					self::SUM_STATUS_ACTIVE   => __( 'Done', 'urlslab' ),
					self::SUM_STATUS_NEW      => __( 'Waiting', 'urlslab' ),
					self::SUM_STATUS_ERROR    => __( 'Error', 'urlslab' ),
					self::SUM_STATUS_PENDING  => __( 'Pending', 'urlslab' ),
					self::SUM_STATUS_UPDATING => __( 'Updating', 'urlslab' ),
				);
			case 'visibility':
				return array(
					self::VISIBILITY_VISIBLE => __( 'Visible', 'urlslab' ),
					self::VISIBILITY_HIDDEN  => __( 'Hidden', 'urlslab' ),
				);
			case 'rel_schedule':
				return array(
					''                           => __( 'Not Requested', 'urlslab' ),
					self::REL_AVAILABLE          => __( 'Done', 'urlslab' ),
					self::REL_SCHEDULE_NEW       => __( 'New', 'urlslab' ),
					self::REL_SCHEDULE_SCHEDULED => __( 'Scheduled', 'urlslab' ),
					self::REL_MANUAL             => __( 'Manual', 'urlslab' ),
					self::REL_ERROR              => __( 'Error', 'urlslab' ),
				);
		}

		return parent::get_enum_column_items( $column );
	}
}
