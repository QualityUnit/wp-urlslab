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
		);
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

	public function get_summary_text( $strategy ): string {
		switch ( $strategy ) {
			case Urlslab_Widget_Link_Enhancer::DESC_TEXT_SUMMARY:
				if ( ! empty( trim( $this->get_url_summary() ) ) ) {
					return trim( $this->get_url_summary() );
				}
				if ( empty( $this->get_sum_status() ) ) {
					$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Link_Enhancer::SLUG );
					if (
						$widget &&
						(
							$this->is_internal() && $widget->get_option( Urlslab_Widget_Link_Enhancer::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS ) ||
							! $this->is_internal() && $widget->get_option( Urlslab_Widget_Link_Enhancer::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS )
						)
					) {
						$this->set_sum_status( self::SUM_STATUS_NEW );
						$this->update();
					}
				} //continue to next option
			case Urlslab_Widget_Link_Enhancer::DESC_TEXT_META_DESCRIPTION:
				if ( ! empty( trim( $this->get_url_meta_description() ) ) ) {
					return trim( $this->get_url_meta_description() );
				} //continue to next option
			case Urlslab_Widget_Link_Enhancer::DESC_TEXT_TITLE:
				if ( ! empty( trim( $this->get_url_h1() ) ) ) {
					return trim( $this->get_url_h1() );
				}
				if ( ! empty( trim( $this->get_url_title() ) ) ) {
					return trim( $this->get_url_title() );
				} //continue to next option
			case Urlslab_Widget_Link_Enhancer::DESC_TEXT_URL:
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
		return ( self::HTTP_STATUS_OK == $this->get_http_status() || 0 > $this->get_http_status() ) && $this->is_visible();
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
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Screenshot::SLUG ) ) {
			switch ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Screenshot::SLUG )->get_option( Urlslab_Widget_Screenshot::SETTING_NAME_SHEDULE_SCRRENSHOT ) ) {
				case Urlslab_Widget_Screenshot::SCHEDULE_ALL:
					break;
				case Urlslab_Widget_Screenshot::SCHEDULE_ALL_INTERNALS:
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
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Screenshot::SLUG ) ) {
			switch ( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Screenshot::SLUG )->get_option( Urlslab_Widget_Screenshot::SETTING_NAME_SHEDULE_SCRRENSHOT ) ) {
				case Urlslab_Widget_Screenshot::SCHEDULE_ALL:
				case Urlslab_Widget_Screenshot::SCHEDULE_SHORTCODE:
					break;
				case Urlslab_Widget_Screenshot::SCHEDULE_ALL_INTERNALS:
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
			$this->set_rel_schedule( Urlslab_Data_Url::REL_SCHEDULE_NEW );
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


	public static function update_url_usage_cnt( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT dest_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' GROUP by dest_url_id ) as c ON u.url_id=c.dest_url_id SET u.url_usage_cnt=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ) ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT dest_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE dest_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by dest_url_id ) as c ON u.url_id=c.dest_url_id SET u.url_usage_cnt=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}


	public static function update_url_links_count( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT src_url_id, count(dest_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' GROUP by src_url_id ) as c ON u.url_id=c.src_url_id SET u.url_links_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ) ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT src_url_id, count(dest_url_id) as cnt FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE src_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by src_url_id ) as c ON u.url_id=c.src_url_id SET u.url_links_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}

	public static function update_screenshot_usage_count( $url_ids = array() ) {
		global $wpdb;

		if ( empty( $url_ids ) ) {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT screenshot_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_SCREENSHOT_URLS_TABLE . ' GROUP by screenshot_url_id ) as c ON u.url_id=c.screenshot_url_id SET u.screenshot_usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END' ) ); // phpcs:ignore
		} else {
			$wpdb->query( $wpdb->prepare( 'UPDATE ' . URLSLAB_URLS_TABLE . ' u LEFT JOIN ( SELECT screenshot_url_id, count(src_url_id) as cnt FROM ' . URLSLAB_SCREENSHOT_URLS_TABLE . ' WHERE screenshot_url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ') GROUP by screenshot_url_id ) as c ON u.url_id=c.screenshot_url_id SET u.screenshot_usage_count=CASE WHEN c.cnt IS NULL THEN 0 ELSE c.cnt END WHERE u.url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%s' ) ) . ')', ...$url_ids, ...$url_ids ) ); // phpcs:ignore
		}
	}

}
