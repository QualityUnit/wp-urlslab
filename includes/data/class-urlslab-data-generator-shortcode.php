<?php

class Urlslab_Data_Generator_Shortcode extends Urlslab_Data {
	public const STATUS_ACTIVE   = 'A';
	public const STATUS_DISABLED = 'D';

	public const AUTOAPPROVE_YES = 'Y';
	public const AUTOAPPROVE_NO  = 'N';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_shortcode_id( $data['shortcode_id'] ?? 0, $loaded_from_db );
		$this->set_flow_id( $data['flow_id'] ?? '', $loaded_from_db );
		$this->set_default_value( $data['default_value'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_ACTIVE, $loaded_from_db );
		$this->set_date_changed( $data['date_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_template( $data['template'] ?? '', $loaded_from_db );
		$this->set_auto_approve( $data['auto_approve'] ?? self::AUTOAPPROVE_NO, $loaded_from_db );
	}

	public function get_shortcode_id(): int {
		return $this->get( 'shortcode_id' );
	}

	public function get_shortcode_name(): string {
		return $this->get( 'shortcode_name' );
	}

	public function set_shortcode_id( int $shortcode_id, $loaded_from_db = false ): void {
		$this->set( 'shortcode_id', $shortcode_id, $loaded_from_db );
	}

	public function set_shortcode_name( string $shortcode_name, $loaded_from_db = false ): void {
		$this->set( 'shortcode_name', $shortcode_name, $loaded_from_db );
	}

	public function get_flow_id(): string {
		return $this->get( 'flow_id' );
	}

	public function set_flow_id( string $flow_id, $loaded_from_db = false ): void {
		$this->set( 'flow_id', $flow_id, $loaded_from_db );
	}

	public function get_template(): string {
		return $this->get( 'template' );
	}

	public function set_template( string $template, $loaded_from_db = false ): void {
		$this->set( 'template', $template, $loaded_from_db );
	}

	public function get_auto_approve(): string {
		return $this->get( 'auto_approve' );
	}

	public function set_auto_approve( string $auto_approve, $loaded_from_db = false ): void {
		$this->set( 'auto_approve', $auto_approve, $loaded_from_db );
	}

	public function get_default_value(): string {
		return $this->get( 'default_value' );
	}

	public function set_default_value( string $default_value, $loaded_from_db = false ): void {
		$this->set( 'default_value', $default_value, $loaded_from_db );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function get_date_changed(): string {
		return $this->get( 'date_changed' );
	}

	public function set_date_changed( string $date_changed, $loaded_from_db = false ): void {
		$this->set( 'date_changed', $date_changed, $loaded_from_db );
	}

	public function get_table_name(): string {
		return URLSLAB_GENERATOR_SHORTCODES_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'shortcode_id' );
	}

	public function get_columns(): array {
		return array(
			'shortcode_id'     => '%d',
			'shortcode_name'   => '%s',
			'flow_id'           => '%s',
			'default_value'    => '%s',
			'status'           => '%s',
			'template'         => '%s',
			'date_changed'     => '%s',
			'auto_approve'     => '%s',
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
					self::STATUS_ACTIVE   => __( 'Active', 'urlslab' ),
					self::STATUS_DISABLED => __( 'Disabled', 'urlslab' ),
				);
		}

		return parent::get_enum_column_items( $column );
	}
}
