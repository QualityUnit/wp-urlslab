<?php

class Urlslab_Data_Web_Vital extends Urlslab_Data {

	const METRIC_TYPE_LCP = 'L';
	const METRIC_TYPE_FID = 'F';
	const METRIC_TYPE_FCP = 'P';
	const METRIC_TYPE_CLS = 'C';
	const METRIC_TYPE_TTFB = 'T';
	const METRIC_TYPE_INP = 'I';

	const NAV_TYPE_NAVIGATE = 'n';
	const NAV_TYPE_RELOAD = 'r';
	const NAV_TYPE_BACK_FORWARD = 'b';
	const NAV_TYPE_BACK_FORWARD_CACHE = 'c';
	const NAV_TYPE_PRERENDER = 'p';
	const NAV_TYPE_RESTORE = 's';

	const RATING_GOOD = 'g';
	const RATING_NEEDS_IMPROVEMENT = 'n';
	const RATING_POOR = 'p';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_wv_id( $data['wv_id'] ?? 0, $loaded_from_db );
		$this->set_event_id( $data['event_id'] ?? '', $loaded_from_db );
		$this->set_metric_type( $data['metric_type'] ?? self::METRIC_TYPE_LCP, $loaded_from_db );
		$this->set_nav_type( $data['nav_type'] ?? self::NAV_TYPE_NAVIGATE, $loaded_from_db );
		$this->set_rating( $data['rating'] ?? self::RATING_GOOD, $loaded_from_db );
		$this->set_url_id( $data['url_id'] ?? 0, $loaded_from_db );
		$this->set_value( $data['value'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_attribution( $data['attribution'] ?? '', $loaded_from_db );
		$this->set_entries( $data['entries'] ?? '', $loaded_from_db );
		$this->set_element( $data['element'] ?? '', $loaded_from_db );
		$this->set_ip( $data['ip'] ?? Urlslab_Widget::get_visitor_ip(), $loaded_from_db );
		$this->set_url_name( $data['url_name'] ?? sanitize_text_field( $_SERVER['HTTP_REFERER'] ?? '' ), $loaded_from_db );
		$this->set_browser( $data['browser'] ?? sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] ?? '' ), $loaded_from_db ); // phpcs:ignore
		$this->set_country( $data['country'] ?? Urlslab_Tool_Geoip::get_country( $this->get_ip() ), $loaded_from_db );
		$this->set_post_type( $data['post_type'] ?? '', $loaded_from_db );
	}

	public function get_wv_id(): int {
		return $this->get( 'wv_id' );
	}

	public function set_wv_id( int $wv_id, bool $loaded_from_db = false ): void {
		$this->set( 'wv_id', $wv_id, $loaded_from_db );
	}

	public function get_event_id(): string {
		return $this->get( 'event_id' );
	}

	public function set_event_id( string $event_id, bool $loaded_from_db = false ): void {
		$this->set( 'event_id', $event_id, $loaded_from_db );
	}

	public function get_metric_type(): string {
		return $this->get( 'metric_type' );
	}

	public function set_metric_type( string $metric_type, bool $loaded_from_db = false ): void {
		switch ( $metric_type ) {
			case 'LCP':
				$metric_type = self::METRIC_TYPE_LCP;
				break;
			case 'FID':
				$metric_type = self::METRIC_TYPE_FID;
				break;
			case 'FCP':
				$metric_type = self::METRIC_TYPE_FCP;
				break;
			case 'CLS':
				$metric_type = self::METRIC_TYPE_CLS;
				break;
			case 'TTFB':
				$metric_type = self::METRIC_TYPE_TTFB;
				break;
			case 'INP':
				$metric_type = self::METRIC_TYPE_INP;
				break;
			default:
				$metric_type = substr( $metric_type, 0, 1 );
		}
		$this->set( 'metric_type', $metric_type, $loaded_from_db );
	}

	public function get_nav_type(): string {
		return $this->get( 'nav_type' );
	}

	public function set_nav_type( string $nav_type, bool $loaded_from_db = false ): void {
		switch ( $nav_type ) {
			case 'navigate':
				$nav_type = self::NAV_TYPE_NAVIGATE;
				break;
			case 'reload':
				$nav_type = self::NAV_TYPE_RELOAD;
				break;
			case 'back_forward':
				$nav_type = self::NAV_TYPE_BACK_FORWARD;
				break;
			case 'back_forward_cache':
				$nav_type = self::NAV_TYPE_BACK_FORWARD_CACHE;
				break;
			case 'prerender':
				$nav_type = self::NAV_TYPE_PRERENDER;
				break;
			case 'restore':
				$nav_type = self::NAV_TYPE_RESTORE;
				break;
			default:
				$nav_type = substr( $nav_type, 0, 1 );
		}
		$this->set( 'nav_type', $nav_type, $loaded_from_db );
	}

	public function get_rating(): string {
		return $this->get( 'rating' );
	}

	public function set_rating( string $rating, bool $loaded_from_db = false ): void {
		switch ( $rating ) {
			case 'good':
				$rating = self::RATING_GOOD;
				break;
			case 'needs_improvement':
				$rating = self::RATING_NEEDS_IMPROVEMENT;
				break;
			case 'poor':
				$rating = self::RATING_POOR;
				break;
			default:
				$rating = substr( $rating, 0, 1 );
		}
		$this->set( 'rating', $rating, $loaded_from_db );
	}

	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function set_url_id( int $url_id, bool $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function get_value(): float {
		return $this->get( 'value' );
	}

	public function set_value( float $value, bool $loaded_from_db = false ): void {
		$this->set( 'value', $value, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_created( string $created, bool $loaded_from_db = false ): void {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_attribution(): string {
		return $this->get( 'attribution' );
	}

	public function set_attribution( string $attribution, bool $loaded_from_db = false ): void {
		$this->set( 'attribution', $attribution, $loaded_from_db );
	}

	public function get_entries(): string {
		return $this->get( 'entries' );
	}

	public function set_entries( string $entries, bool $loaded_from_db = false ): void {
		$this->set( 'entries', $entries, $loaded_from_db );
	}

	public function get_element(): string {
		return $this->get( 'element' );
	}

	public function set_element( string $element, bool $loaded_from_db = false ): void {
		$this->set( 'element', $element, $loaded_from_db );
	}

	public function get_ip(): string {
		return $this->get( 'ip' );
	}

	public function set_ip( string $ip, bool $loaded_from_db = false ): void {
		$this->set( 'ip', $ip, $loaded_from_db );
	}

	public function get_url_name(): string {
		return $this->get( 'url_name' );
	}

	public function set_url_name( string $url_name, bool $loaded_from_db = false ): void {
		$this->set( 'url_name', $url_name, $loaded_from_db );
	}

	public function get_browser(): string {
		return $this->get( 'browser' );
	}

	public function set_browser( string $browser, bool $loaded_from_db = false ): void {
		$this->set( 'browser', $browser, $loaded_from_db );
	}

	public function get_country(): string {
		return $this->get( 'country' );
	}

	public function set_country( string $country, bool $loaded_from_db = false ): void {
		$this->set( 'country', $country, $loaded_from_db );
	}

	public function get_post_type(): string {
		return $this->get( 'post_type' );
	}

	public function set_post_type( string $post_type, bool $loaded_from_db = false ): void {
		$this->set( 'post_type', $post_type, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_WEB_VITALS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'wv_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'wv_id'       => '%d',
			'event_id'    => '%s',
			'metric_type' => '%s',
			'nav_type'    => '%s',
			'rating'      => '%s',
			'url_id'      => '%d',
			'value'       => '%f',
			'created'     => '%s',
			'attribution' => '%s',
			'entries'     => '%s',
			'element'     => '%s',
			'ip'          => '%s',
			'url_name'    => '%s',
			'browser'     => '%s',
			'country'     => '%s',
			'post_type'     => '%s',
		);
	}
}
