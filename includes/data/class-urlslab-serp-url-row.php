<?php

class Urlslab_Serp_Url_Row extends Urlslab_Data {

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
		$this->set_my_impressions( $url['my_impressions'] ?? 0, $loaded_from_db );
		$this->set_my_clicks( $url['my_clicks'] ?? 0, $loaded_from_db );
		$this->set_top_queries( $url['top_queries'] ?? '', $loaded_from_db );
		$this->set_recomputed( $url['recomputed'] ?? self::get_now( time() - 8000000 ), $loaded_from_db );
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
			'url_id'             => '%d',
			'domain_id'          => '%d',
			'url_name'           => '%s',
			'url_title'          => '%s',
			'url_description'    => '%s',
			'comp_intersections' => '%d',
			'best_position'      => '%d',
			'top10_queries_cnt'  => '%d',
			'top100_queries_cnt' => '%d',
			'my_impressions'     => '%d',
			'my_clicks'          => '%d',
			'top_queries'        => '%s',
			'recomputed'         => '%s',
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

	public static function update_serp_data( $validity = 3600, $limit = 50000 ) {
		global $wpdb;
		$wpdb->query( 'SET SESSION group_concat_max_len = 500' );

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				' uu INNER JOIN (
							SELECT u.url_id,
								MIN(p.position) AS best_position,
								SUM(p.impressions) AS my_impressions,
								SUM(p.clicks) AS my_clicks,
								COUNT(*) as top100_queries_cnt,
								SUM(CASE WHEN p.position <= 10 THEN 1 ELSE 0 END) AS top10_queries_cnt,
								GROUP_CONCAT(DISTINCT query order by p.position) as top_queries,
								COUNT(DISTINCT po.domain_id) as comp_intersections
							FROM ' . URLSLAB_SERP_URLS_TABLE . // phpcs:ignore
				' u	INNER JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . // phpcs:ignore
				' p ON u.url_id = p.url_id
							INNER JOIN ' . URLSLAB_SERP_QUERIES_TABLE . // phpcs:ignore
				' q ON q.query_id = p.query_id
							LEFT JOIN ' . URLSLAB_SERP_POSITIONS_TABLE . // phpcs:ignore
				' po ON p.query_id=po.query_id AND po.position<10 AND po.url_id <> p.url_id AND po.domain_id IN (' .
				implode( ',', array_keys( Urlslab_Serp_Domain_Row::get_competitor_domains() ) ) . // phpcs:ignore
				')
							WHERE u.recomputed IS NULL OR u.recomputed<%s
							GROUP BY u.url_id
							LIMIT %d
						) AS s ON uu.url_id=s.url_id
						SET uu.best_position=s.best_position,
							uu.my_impressions=s.my_impressions,
							uu.my_clicks=s.my_clicks,
							uu.comp_intersections=s.comp_intersections,
							uu.top10_queries_cnt=s.top10_queries_cnt,
							uu.top100_queries_cnt=s.top100_queries_cnt,
							uu.top_queries=s.top_queries,
							uu.recomputed=%s',
				Urlslab_Data::get_now( time() - $validity ),
				$limit,
				Urlslab_Data::get_now()
			)
		);

	}
}
