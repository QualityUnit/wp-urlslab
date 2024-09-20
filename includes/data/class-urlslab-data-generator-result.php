<?php

class Urlslab_Data_Generator_Result extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_WAITING_APPROVAL = 'W';
	public const STATUS_PENDING = 'P';
	public const STATUS_DISABLED = 'D';
	public const STATUS_NEW = 'N';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_shortcode_id( $data['shortcode_id'] ?? 0, $loaded_from_db );
		$this->set_prompt_variables( $data['prompt_variables'] ?? '', $loaded_from_db );
		$this->set_result( $data['result'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_WAITING_APPROVAL, $loaded_from_db );
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
		return crc32( $this->get_prompt_variables() );
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
		return URLSLAB_GENERATOR_SHORTCODE_RESULTS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'hash_id' );
	}

	public function get_columns(): array {
		return array(
			'shortcode_id'     => '%d',
			'hash_id'          => '%d',
			'prompt_variables' => '%s',
			'result'           => '%s',
			'status'           => '%s',
			'date_changed'     => '%s',
			'labels'           => '%s',
		);
	}


	public function is_active(): bool {
		return self::STATUS_ACTIVE === $this->get_status();
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'date_changed':
				return self::COLUMN_TYPE_DATE;
			case 'status':
				return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'status':
				return array(
					self::STATUS_ACTIVE           => __( 'Active', 'urlslab' ),
					self::STATUS_NEW              => __( 'New', 'urlslab' ),
					self::STATUS_WAITING_APPROVAL => __( 'Waiting approval', 'urlslab' ),
					self::STATUS_PENDING          => __( 'Pending', 'urlslab' ),
					self::STATUS_DISABLED         => __( 'Disabled', 'urlslab' ),
				);
		}

		return parent::get_enum_column_items( $column );
	}
}
