<?php

class Urlslab_Generator_Result_Row extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_NEW = 'N';
	public const STATUS_PENDING = 'P';
	public const STATUS_WAITING_APPROVAL = 'W';
	public const STATUS_DISABLED = 'D';
	public const DO_NOT_KNOW = 'DO_NOT_KNOW';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_shortcode_id( $data['shortcode_id'] ?? 0, $loaded_from_db );
		$this->set_semantic_context( $data['semantic_context'] ?? '', $loaded_from_db );
		$this->set_prompt_variables( $data['prompt_variables'] ?? '', $loaded_from_db );
		$this->set_result( $data['result'] ?? '', $loaded_from_db );
		$this->set_url_filter( $data['url_filter'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_NEW, $loaded_from_db );
		$this->set_date_changed( $data['date_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_labels( $data['labels'] ?? '', $loaded_from_db );
		$this->set_hash_id( $data['hash_id'] ?? $this->compute_hash_id(), $loaded_from_db );
	}

	public function get_shortcode_id(): int {
		return $this->get( 'shortcode_id' );
	}

	public function set_shortcode_id( int $shortcode_id, $loaded_from_db = false ): void {
		$this->set( 'shortcode_id', $shortcode_id, $loaded_from_db );
	}

	public function get_hash_id(): int {
		return $this->get( 'hash_id' );
	}

	public function set_hash_id( int $hash_id, $loaded_from_db = false ): void {
		$this->set( 'hash_id', $hash_id, $loaded_from_db );
	}

	private function compute_hash_id(): int {
		return crc32( $this->get_semantic_context() . $this->get_prompt_variables() . $this->get_url_filter() );
	}

	public function get_semantic_context(): string {
		return $this->get( 'semantic_context' );
	}

	public function set_semantic_context( string $semantic_context, $loaded_from_db = false ): void {
		$this->set( 'semantic_context', $semantic_context, $loaded_from_db );
	}

	public function get_prompt_variables(): string {
		return $this->get( 'prompt_variables' );
	}

	public function set_prompt_variables( string $prompt, $loaded_from_db = false ): void {
		$this->set( 'prompt_variables', $prompt, $loaded_from_db );
	}

	public function get_result(): string {
		return $this->get( 'result' );
	}

	public function set_result( string $result, $loaded_from_db = false ): void {
		$this->set( 'result', $result, $loaded_from_db );
	}

	public function get_url_filter(): string {
		return $this->get( 'url_filter' );
	}

	public function set_url_filter( string $url_filter, $loaded_from_db = false ): void {
		$this->set( 'url_filter', $url_filter, $loaded_from_db );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
		$this->set_date_changed( self::get_now(), $loaded_from_db );
	}

	public function get_date_changed(): string {
		return $this->get( 'date_changed' );
	}

	public function set_date_changed( string $date_changed, $loaded_from_db = false ): void {
		$this->set( 'date_changed', $date_changed, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GENERATOR_RESULTS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'hash_id' );
	}

	public function get_columns(): array {
		return array(
			'shortcode_id'     => '%d',
			'hash_id'          => '%d',
			'semantic_context' => '%s',
			'prompt_variables' => '%s',
			'result'           => '%s',
			'url_filter'       => '%s',
			'status'           => '%s',
			'date_changed'     => '%s',
			'labels'           => '%s',
		);
	}


	public function is_active(): bool {
		return self::STATUS_ACTIVE === $this->get_status() && false === strpos( $this->get_result(), self::DO_NOT_KNOW );
	}


}
