<?php

class Urlslab_Data_Serp_Query extends Urlslab_Data {
	public const STATUS_NOT_PROCESSED = 'X';
	public const STATUS_PROCESSING = 'P';
	public const STATUS_PROCESSED = 'A';
	public const STATUS_ERROR = 'E';
	public const STATUS_SKIPPED = 'S';

	public const TYPE_USER = 'U';
	public const TYPE_SERP_RELATED = 'S';
	public const TYPE_SERP_FAQ = 'F';
	public const TYPE_GSC = 'C';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $query = array(), $loaded_from_db = true ) {
		$this->set_query( $query['query'] ?? '', $loaded_from_db );
		$this->set_parent_query_id( $query['parent_query_id'] ?? 0, $loaded_from_db );
		$this->set_updated( $query['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_status( $query['status'] ?? self::STATUS_NOT_PROCESSED, $loaded_from_db );
		$this->set_type( $query['type'] ?? self::TYPE_SERP_RELATED, $loaded_from_db );
		$this->set_labels( $query['labels'] ?? '', $loaded_from_db );
		$this->set_query_id( $query['query_id'] ?? $this->compute_query_id(), $loaded_from_db );
		$this->set_country( $query['country'] ?? 'us', $loaded_from_db );
		$this->set_recomputed( $query['recomputed'] ?? self::get_now( time() - 800000 ), $loaded_from_db );
		$this->set_comp_intersections( $query['comp_intersections'] ?? 0, $loaded_from_db );
		$this->set_my_position( $query['my_position'] ?? 0, $loaded_from_db );
		$this->set_my_urls( $query['my_urls'] ?? '', $loaded_from_db );
		$this->set_comp_urls( $query['comp_urls'] ?? '', $loaded_from_db );
		$this->set_my_urls_ranked_top10( $query['my_urls_ranked_top10'] ?? 0, $loaded_from_db );
		$this->set_my_urls_ranked_top100( $query['my_urls_ranked_top100'] ?? 0, $loaded_from_db );
		$this->set_internal_links( $query['internal_links'] ?? 0, $loaded_from_db );
		$this->set_schedule_interval( $query['schedule_interval'] ?? '', $loaded_from_db );
		$this->set_schedule( $query['schedule'] ?? self::get_now(), $loaded_from_db );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function get_query(): string {
		return $this->get( 'query' );
	}

	public function get_parent_query_id(): int {
		return $this->get( 'parent_query_id' );
	}

	public function set_parent_query_id( int $parent_query_id, $loaded_from_db = false ): void {
		$this->set( 'parent_query_id', $parent_query_id, $loaded_from_db );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function get_type(): string {
		return $this->get( 'type' );
	}

	public function set_query_id( int $query_id, $loaded_from_db = false ): void {
		$this->set( 'query_id', $query_id, $loaded_from_db );
	}

	public function set_query( string $query, $loaded_from_db = false ): void {
		$this->set( 'query', $query, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		if ( ! $loaded_from_db && self::STATUS_PROCESSED === $status && self::STATUS_PROCESSED !== $this->get_status() ) {
			$this->set_schedule( self::get_now( time() + $this->get_schedule_delay() ), $loaded_from_db );
		}

		$this->set( 'status', $status, $loaded_from_db );
		if ( ! $loaded_from_db ) {
			$this->set_updated( self::get_now(), $loaded_from_db );
		}
	}

	public function set_type( string $type, $loaded_from_db = false ): void {
		$this->set( 'type', $type, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}


	public function get_recomputed(): string {
		return $this->get( 'recomputed' );
	}

	public function set_recomputed( string $recomputed, $loaded_from_db = false ): void {
		$this->set( 'recomputed', $recomputed, $loaded_from_db );
	}

	public function get_comp_intersections(): int {
		return $this->get( 'comp_intersections' );
	}

	public function set_comp_intersections( int $comp_intersections, $loaded_from_db = false ): void {
		$this->set( 'comp_intersections', $comp_intersections, $loaded_from_db );
	}

	public function get_my_position(): float {
		return $this->get( 'my_position' );
	}

	public function set_my_position( float $my_position, $loaded_from_db = false ): void {
		$this->set( 'my_position', $my_position, $loaded_from_db );
	}

	public function get_my_urls(): string {
		return $this->get( 'my_urls' );
	}

	public function set_my_urls( string $my_urls, $loaded_from_db = false ): void {
		$this->set( 'my_urls', $my_urls, $loaded_from_db );
	}

	public function get_comp_urls(): string {
		return $this->get( 'comp_urls' );
	}

	public function set_comp_urls( string $comp_urls, $loaded_from_db = false ): void {
		$this->set( 'comp_urls', $comp_urls, $loaded_from_db );
	}

	public function get_my_urls_ranked_top10(): int {
		return $this->get( 'my_urls_ranked_top10' );
	}

	public function get_my_urls_ranked_top100(): int {
		return $this->get( 'my_urls_ranked_top100' );
	}

	public function set_my_urls_ranked_top10( int $my_urls_ranked_top10, $loaded_from_db = false ): void {
		$this->set( 'my_urls_ranked_top10', $my_urls_ranked_top10, $loaded_from_db );
	}

	public function set_my_urls_ranked_top100( int $my_urls_ranked_top100, $loaded_from_db = false ): void {
		$this->set( 'my_urls_ranked_top100', $my_urls_ranked_top100, $loaded_from_db );
	}

	public function get_country(): string {
		return $this->get( 'country' );
	}

	public function set_country( string $country, $loaded_from_db = false ): void {
		$this->set( 'country', $country, $loaded_from_db );
	}

	public function get_internal_links(): int {
		return $this->get( 'internal_links' );
	}

	public function set_internal_links( int $internal_links, $loaded_from_db = false ): void {
		$this->set( 'internal_links', $internal_links, $loaded_from_db );
	}

	public function get_schedule(): string {
		return $this->get( 'schedule' );
	}

	public function set_schedule( string $schedule, $loaded_from_db = false ): void {
		$this->set( 'schedule', $schedule, $loaded_from_db );
	}

	public function get_schedule_interval(): string {
		return $this->get( 'schedule_interval' );
	}

	public function set_schedule_interval( string $schedule_interval, $loaded_from_db = false ): void {
		if ( ! $loaded_from_db && $schedule_interval !== $this->get_schedule_interval() ) {
			$this->set( 'schedule_interval', $schedule_interval, $loaded_from_db );
			$this->set_schedule( self::get_now( time() + $this->get_schedule_delay() ), $loaded_from_db );
		} else {
			$this->set( 'schedule_interval', $schedule_interval, $loaded_from_db );
		}
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_QUERIES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'query_id', 'country' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'query_id'              => '%d',
			'parent_query_id'       => '%d',
			'country'               => '%s',
			'query'                 => '%s',
			'updated'               => '%s',
			'status'                => '%s',
			'type'                  => '%s',
			'labels'                => '%s',
			'recomputed'            => '%s',
			'comp_intersections'    => '%d',
			'my_position'           => '%d',
			'my_urls'               => '%s',
			'my_urls_ranked_top10'  => '%d',
			'my_urls_ranked_top100' => '%d',
			'internal_links'        => '%d',
			'comp_urls'             => '%s',
			'schedule'              => '%s',
			'schedule_interval'     => '%s',
		);
	}

	private function compute_query_id() {
		return crc32( $this->get_query() );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		$result = parent::set( $name, $value, $loaded_from_db ); // TODO: Change the autogenerated stub
		if ( in_array( $name, array( 'query' ) ) ) {
			$this->set( 'query_id', $this->compute_query_id(), $loaded_from_db );
		}

		return $result;
	}

	public static function update_serp_data( $validity = 172800, $limit = 10000 ) {
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );
		$first_gsc_join  = ' p ON q.query_id = p.query_id AND q.country=p.country';
		$second_gsc_join = ' cp ON q.query_id = cp.query_id AND q.country=cp.country AND cp.position<11';
		if ( ! empty( Urlslab_Data_Serp_Domain::get_my_domains() ) ) {
			$first_gsc_join .= ' AND p.domain_id IN (' . implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_my_domains() ) ) . ')';
		}
		if ( ! empty( Urlslab_Data_Serp_Domain::get_competitor_domains() ) ) {
			$second_gsc_join .= ' AND cp.domain_id IN (' . implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_competitor_domains() ) ) . ')';
		}

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . URLSLAB_SERP_QUERIES_TABLE . // phpcs:ignore
				' qq
						INNER JOIN (
							SELECT q.query_id, q.country,
								MIN(p.position) AS my_position,
								COUNT(DISTINCT CASE WHEN p.position <= 10 THEN p.url_id ELSE NULL END) AS my_urls_ranked_top10,
								COUNT(DISTINCT p.url_id) AS my_urls_ranked_top100,
								GROUP_CONCAT(DISTINCT u.url_name ORDER BY p.position) AS my_urls,
								GROUP_CONCAT(DISTINCT cu.url_name ORDER BY cp.position) AS comp_urls,
								COUNT(DISTINCT cp.domain_id) AS comp_intersections,
								COUNT(m.url_id) AS internal_links
							FROM ' . URLSLAB_SERP_QUERIES_TABLE . // phpcs:ignore
				' 			q	LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . $first_gsc_join . // phpcs:ignore
				'			LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				'			 u ON p.url_id=u.url_id
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . $second_gsc_join . // phpcs:ignore
				'			LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				'			 cu ON cp.url_id=cu.url_id
							LEFT JOIN ' . URLSLAB_KEYWORDS_TABLE . // phpcs:ignore
				' 				k ON k.query_id=q.query_id
                            LEFT JOIN ' . URLSLAB_KEYWORDS_MAP_TABLE . // phpcs:ignore
				' 			m ON k.kw_id=m.kw_id AND u.url_id=m.dest_url_id
							WHERE q.recomputed IS NULL OR q.recomputed<%s
							GROUP BY q.query_id, q.country
							LIMIT %d
						) AS s ON qq.query_id=s.query_id AND qq.country=s.country
						SET qq.my_position=CASE WHEN s.my_position IS NULL THEN 0 ELSE s.my_position END,
							qq.my_urls=CASE WHEN s.my_urls IS NULL THEN \'\' ELSE s.my_urls END,
							qq.comp_urls=CASE WHEN s.comp_urls IS NULL THEN \'\' ELSE s.comp_urls END,
							qq.comp_intersections=CASE WHEN s.comp_intersections IS NULL THEN 0 ELSE s.comp_intersections END,
							qq.my_urls_ranked_top10=CASE WHEN s.my_urls_ranked_top10 IS NULL THEN 0 ELSE s.my_urls_ranked_top10 END,
							qq.my_urls_ranked_top100=CASE WHEN s.my_urls_ranked_top100 IS NULL THEN 0 ELSE s.my_urls_ranked_top100 END,
							qq.internal_links=CASE WHEN s.internal_links IS NULL THEN 0 ELSE s.internal_links END,
							qq.recomputed=%s',
				Urlslab_Data::get_now( time() - $validity ),
				$limit,
				Urlslab_Data::get_now()
			)
		);

	}

	private function get_schedule_delay() {
		$interval = $this->get_schedule_interval();
		if ( empty( $interval ) ) {
			$interval = substr( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Serp::SLUG )->get_option( Urlslab_Widget_Serp::SETTING_NAME_SYNC_FREQ ), 0, 1 );
		}
		if ( substr( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_DAILY, 0, 1 ) === $interval ) {
			return 86400;
		} else if ( substr( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_WEEKLY, 0, 1 ) === $interval ) {
			return 86400 * 7;
		} else if ( substr( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_MONTHLY, 0, 1 ) === $interval ) {
			return 86400 * 30;
		} else if ( substr( Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalSerpApiSearchRequest::NOT_OLDER_THAN_YEARLY, 0, 1 ) === $interval ) {
			return 86400 * 365;
		} else {
			return 0;
		}
	}

}