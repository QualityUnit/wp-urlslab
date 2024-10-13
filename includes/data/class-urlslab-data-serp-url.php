<?php

class Urlslab_Data_Serp_Url extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $url = array(), $loaded_from_db = true ) {
		$this->set_url_name( $url['url_name'] ?? '', $loaded_from_db );
		$this->set_url_title( $url['url_title'] ?? '', $loaded_from_db );
		$this->set_url_description( $url['url_description'] ?? '', $loaded_from_db );
		$this->set_url_id( $url['url_id'] ?? $this->compute_url_id(), $loaded_from_db );
		$this->set_domain_id( $url['domain_id'] ?? $this->compute_domain_id(), $loaded_from_db );
		$this->set_comp_intersections( $url['comp_intersections'] ?? 0, $loaded_from_db );
		$this->set_best_position( $url['best_position'] ?? 0, $loaded_from_db );
		$this->set_top10_queries_cnt( $url['top10_queries_cnt'] ?? 0, $loaded_from_db );
		$this->set_top100_queries_cnt( $url['top100_queries_cnt'] ?? 0, $loaded_from_db );
		$this->set_top_queries( $url['top_queries'] ?? '', $loaded_from_db );
		$this->set_recomputed( $url['recomputed'] ?? self::get_now( time() - 8000000 ), $loaded_from_db );
		$this->set_my_urls_ranked_top10( $url['my_urls_ranked_top10'] ?? 0, $loaded_from_db );
		$this->set_my_urls_ranked_top100( $url['my_urls_ranked_top100'] ?? 0, $loaded_from_db );
		$this->set_country_volume( $url['country_volume'] ?? 0, $loaded_from_db );
		$this->set_country_value( $url['country_value'] ?? 0, $loaded_from_db );
	}


	public function get_url_id(): int {
		return $this->get( 'url_id' );
	}

	public function get_domain_id(): int {
		return $this->get( 'domain_id' );
	}

	public function get_url_name(): string {
		return $this->get( 'url_name' );
	}

	public function get_url_title(): string {
		return $this->get( 'url_title' );
	}

	public function get_url_description(): string {
		return $this->get( 'url_description' );
	}

	public function set_url_id( int $url_id, $loaded_from_db = false ): void {
		$this->set( 'url_id', $url_id, $loaded_from_db );
	}

	public function set_domain_id( int $domain_id, $loaded_from_db = false ): void {
		$this->set( 'domain_id', $domain_id, $loaded_from_db );
	}

	public function set_url_name( string $url_name, $loaded_from_db = false ): void {
		$this->set( 'url_name', $url_name, $loaded_from_db );
	}

	public function set_url_title( string $url_title, $loaded_from_db = false ): void {
		$this->set( 'url_title', $url_title, $loaded_from_db );
	}

	public function set_url_description( string $url_description, $loaded_from_db = false ): void {
		$this->set( 'url_description', $url_description, $loaded_from_db );
	}

	public function get_comp_intersections(): int {
		return $this->get( 'comp_intersections' );
	}

	public function set_comp_intersections( int $comp_intersections, $loaded_from_db = false ): void {
		$this->set( 'comp_intersections', $comp_intersections, $loaded_from_db );
	}

	public function get_best_position(): int {
		return $this->get( 'best_position' );
	}

	public function set_best_position( int $best_position, $loaded_from_db = false ): void {
		$this->set( 'best_position', $best_position, $loaded_from_db );
	}

	public function get_top10_queries_cnt(): int {
		return $this->get( 'top10_queries_cnt' );
	}

	public function set_top10_queries_cnt( int $top10_queries_cnt, $loaded_from_db = false ): void {
		$this->set( 'top10_queries_cnt', $top10_queries_cnt, $loaded_from_db );
	}

	public function get_top100_queries_cnt(): int {
		return $this->get( 'top100_queries_cnt' );
	}

	public function set_top100_queries_cnt( int $top100_queries_cnt, $loaded_from_db = false ): void {
		$this->set( 'top100_queries_cnt', $top100_queries_cnt, $loaded_from_db );
	}

	public function get_top_queries(): string {
		return $this->get( 'top_queries' );
	}

	public function set_top_queries( string $top_queries, $loaded_from_db = false ): void {
		$this->set( 'top_queries', $top_queries, $loaded_from_db );
	}

	public function get_recomputed(): string {
		return $this->get( 'recomputed' );
	}

	public function set_recomputed( string $recomputed, $loaded_from_db = false ): void {
		$this->set( 'recomputed', $recomputed, $loaded_from_db );
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

	public function get_country_volume(): int {
		return $this->get( 'country_volume' );
	}

	public function set_country_volume( int $country_volume, $loaded_from_db = false ): void {
		$this->set( 'country_volume', $country_volume, $loaded_from_db );
	}

	public function get_country_value(): int {
		return $this->get( 'country_value' );
	}

	public function set_country_value( int $country_value, $loaded_from_db = false ): void {
		$this->set( 'country_value', $country_value, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_SERP_URLS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'url_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function get_columns(): array {
		return array(
			'url_id'                => '%d',
			'domain_id'             => '%d',
			'url_name'              => '%s',
			'url_title'             => '%s',
			'url_description'       => '%s',
			'comp_intersections'    => '%d',
			'best_position'         => '%d',
			'top10_queries_cnt'     => '%d',
			'top100_queries_cnt'    => '%d',
			'top_queries'           => '%s',
			'recomputed'            => '%s',
			'my_urls_ranked_top10'  => '%d',
			'my_urls_ranked_top100' => '%d',
			'country_volume'        => '%d',
			'country_value'         => '%d',
		);
	}

	private function compute_url_id(): int {
		if ( empty( $this->get_url_name() ) ) {
			return 0;
		}

		try {
			$url = new Urlslab_Url( $this->get_url_name(), true );

			return $url->get_url_id();
		} catch ( Exception $e ) {
			return 0;
		}
	}

	private function compute_domain_id() {
		if ( empty( $this->get_url_name() ) ) {
			return 0;
		}
		try {
			$url = new Urlslab_Url( $this->get_url_name(), true );

			return $url->get_domain_id();
		} catch ( Exception $e ) {
			return 0;
		}
	}

	public function get_column_type( string $column, $format ) {
		if ( 'domain_type' === $column ) {
			return Urlslab_Data::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'domain_type':
				return Urlslab_Data_Serp_Domain::domainTypes();
		}

		return parent::get_enum_column_items( $column );
	}

	public static function update_serp_data( $validity = 300000, $limit = 1000 ) {
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				' uu INNER JOIN (
							SELECT u.url_id,
								MIN(p.position) AS best_position,
								COUNT(DISTINCT p.query_id) as top100_queries_cnt,
								COUNT(DISTINCT ( CASE WHEN p.position <= 10 THEN p.query_id ELSE NULL END ) ) AS top10_queries_cnt,
								COUNT(DISTINCT pm.url_id ) as my_urls_ranked_top100,
								COUNT(DISTINCT ( CASE WHEN pm.position <= 10 THEN pm.url_id ELSE NULL END) ) AS my_urls_ranked_top10,
								GROUP_CONCAT( DISTINCT query order by p.position ) as top_queries,
								COUNT( DISTINCT po.domain_id ) as comp_intersections,
								SUM( CASE WHEN p.position BETWEEN 1 AND 10 THEN q.country_volume * 0.844*EXP(-0.547*p.position) ELSE 0 END ) AS country_volume,
								SUM( CASE WHEN p.position <= 10 THEN q.country_volume * 0.844*EXP(-0.547*p.position) * q.country_high_bid ELSE 0 END ) AS country_value
							FROM ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				' u	INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . // phpcs:ignore
				' p ON u.url_id = p.url_id
							INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . // phpcs:ignore
				' q ON q.query_id = p.query_id AND q.country=p.country
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . // phpcs:ignore
				' po ON p.query_id=po.query_id AND p.country=po.country AND po.position<10 AND po.url_id <> p.url_id AND po.domain_id IN (' .
				implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_competitor_domains() ) ) . // phpcs:ignore
				')
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . // phpcs:ignore
				' pm ON p.query_id=pm.query_id AND p.country=pm.country AND pm.url_id <> p.url_id AND pm.domain_id IN (' .
				implode( ',', array_keys( Urlslab_Data_Serp_Domain::get_my_domains() ) ) . // phpcs:ignore
				')
							WHERE u.recomputed IS NULL OR u.recomputed<%s
							GROUP BY u.url_id
							LIMIT %d
						) AS s ON uu.url_id=s.url_id
						SET uu.best_position=CASE WHEN s.best_position IS NULL THEN 0 ELSE s.best_position END,
							uu.comp_intersections=CASE WHEN s.comp_intersections IS NULL THEN 0 ELSE s.comp_intersections END,
							uu.top10_queries_cnt=CASE WHEN s.top10_queries_cnt IS NULL THEN 0 ELSE s.top10_queries_cnt END,
							uu.top100_queries_cnt=CASE WHEN s.top100_queries_cnt IS NULL THEN 0 ELSE s.top100_queries_cnt END,
							uu.my_urls_ranked_top10=CASE WHEN s.my_urls_ranked_top10 IS NULL THEN 0 ELSE s.my_urls_ranked_top10 END,
							uu.my_urls_ranked_top100=CASE WHEN s.my_urls_ranked_top100 IS NULL THEN 0 ELSE s.my_urls_ranked_top100 END,
							uu.top_queries=s.top_queries,
							uu.country_volume=CASE WHEN s.country_volume IS NULL THEN 0 ELSE s.country_volume END,
							uu.country_value=CASE WHEN s.country_value IS NULL THEN 0 ELSE s.country_value END,
							uu.recomputed=%s',
				Urlslab_Data::get_now( max( time() - $validity, get_transient( Urlslab_Widget_Serp::SETTING_NAME_SERP_DATA_TIMESTAMP ) ?? 0 ) ),
				$limit,
				Urlslab_Data::get_now()
			)
		);
	}
}
