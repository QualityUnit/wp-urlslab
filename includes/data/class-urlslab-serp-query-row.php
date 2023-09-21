<?php

class Urlslab_Serp_Query_Row extends Urlslab_Data {
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
		$this->set_updated( $query['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_status( $query['status'] ?? self::STATUS_NOT_PROCESSED, $loaded_from_db );
		$this->set_type( $query['type'] ?? self::TYPE_SERP_RELATED, $loaded_from_db );
		$this->set_labels( $query['labels'] ?? '', $loaded_from_db );
		$this->set_query_id( $query['query_id'] ?? $this->compute_query_id(), $loaded_from_db );
		$this->set_recomputed( $query['recomputed'] ?? self::get_now(time()-800000), $loaded_from_db );
		$this->set_comp_intersections( $query['comp_intersections'] ?? 0, $loaded_from_db );
		$this->set_my_position( $query['my_position'] ?? 0, $loaded_from_db );
		$this->set_my_impressions( $query['my_impressions'] ?? 0, $loaded_from_db );
		$this->set_my_clicks( $query['my_clicks'] ?? 0, $loaded_from_db );
		$this->set_my_ctr( $query['my_ctr'] ?? 0, $loaded_from_db );
		$this->set_my_urls( $query['my_urls'] ?? '', $loaded_from_db );
		$this->set_comp_urls( $query['comp_urls'] ?? '', $loaded_from_db );
	}

	public function get_query_id(): int {
		return $this->get( 'query_id' );
	}

	public function get_query(): string {
		return $this->get( 'query' );
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

	public function get_my_impressions(): int {
		return $this->get( 'my_impressions' );
	}

	public function set_my_impressions( int $my_impressions, $loaded_from_db = false ): void {
		$this->set( 'my_impressions', $my_impressions, $loaded_from_db );
	}

	public function get_my_clicks(): int {
		return $this->get( 'my_clicks' );
	}

	public function set_my_clicks( int $my_clicks, $loaded_from_db = false ): void {
		$this->set( 'my_clicks', $my_clicks, $loaded_from_db );
	}

	public function get_my_ctr(): float {
		return $this->get( 'my_ctr' );
	}

	public function set_my_ctr( float $my_ctr, $loaded_from_db = false ): void {
		$this->set( 'my_ctr', $my_ctr, $loaded_from_db );
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

	public function get_table_name(): string {
		return URLSLAB_SERP_QUERIES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'query_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'query_id'           => '%d',
			'query'              => '%s',
			'updated'            => '%s',
			'status'             => '%s',
			'type'               => '%s',
			'labels'             => '%s',
			'recomputed'         => '%s',
			'comp_intersections' => '%d',
			'my_position'        => '%d',
			'my_impressions'     => '%d',
			'my_clicks'          => '%d',
			'my_ctr'             => '%d',
			'my_urls'            => '%s',
			'comp_urls'          => '%s',
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

	public static function update_serp_data($validity = 3600) {
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );

		$first_gsc_join  = ' p ON q.query_id = p.query_id';
		$second_gsc_join = ' cp ON q.query_id = cp.query_id AND cp.position<11';
		if ( ! empty( Urlslab_Serp_Domain_Row::get_my_domains() ) ) {
			$first_gsc_join .= ' AND p.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_my_domains() ) ) . ')';
		}
		if ( ! empty( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) {
			$second_gsc_join .= ' AND cp.domain_id IN (' . implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . ')';
		}

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . URLSLAB_SERP_QUERIES_TABLE . ' qq
						INNER JOIN (
							SELECT q.query_id,
								AVG(p.position) AS my_position,
								SUM(p.impressions) AS my_impressions,
								SUM(p.clicks) AS my_clicks,
								AVG(p.ctr) AS my_ctr,
								GROUP_CONCAT(DISTINCT u.url_name ORDER BY p.clicks, p.impressions) AS my_urls,
								GROUP_CONCAT(DISTINCT cu.url_name ORDER BY cp.position) AS comp_urls,
								COUNT(DISTINCT cp.domain_id) AS comp_intersections
							FROM ' . URLSLAB_SERP_QUERIES_TABLE . ' q
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . $first_gsc_join . '
							LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' u ON p.url_id=u.url_id
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . $second_gsc_join . '
							LEFT JOIN ' . URLSLAB_SERP_URLS_TABLE . ' cu ON cp.url_id=cu.url_id
							WHERE q.recomputed IS NULL OR q.recomputed<%s
							GROUP BY q.query_id
						) AS s ON qq.query_id=s.query_id
						SET qq.my_position=s.my_position,
							qq.my_impressions=s.my_impressions,
							qq.my_clicks=s.my_clicks,
							qq.my_ctr=s.my_ctr,
							qq.my_urls=s.my_urls,
							qq.comp_urls=s.comp_urls,
							qq.comp_intersections=s.comp_intersections,
							qq.recomputed=%s',
				Urlslab_Data::get_now( time() - $validity ),
				Urlslab_Data::get_now()
			)
		);

	}

}
