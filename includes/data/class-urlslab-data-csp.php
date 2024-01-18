<?php

class Urlslab_Data_Csp extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_blocked_url( $data['blocked_url'] ?? '', $loaded_from_db );
		$this->set_violated_directive( $data['violated_directive'] ?? '', $loaded_from_db );
		$this->set_updated( $data['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_blocked_url_id( $data['blocked_url_id'] ?? 0, $loaded_from_db );
	}

	public function has_autoincrement_primary_column(): bool {
		return false;
	}

	public function set_violated_directive( $violated_directive, $loaded_from_db = false ) {
		$this->set( 'violated_directive', $violated_directive, $loaded_from_db );
	}

	public function get_violated_directive() {
		return $this->get( 'violated_directive' );
	}


	public function set_blocked_url( $blocked_url, $loaded_from_db = false ) {
		$this->set( 'blocked_url', $blocked_url, $loaded_from_db );
	}

	public function get_blocked_url() {
		return $this->get( 'blocked_url' );
	}

	public function set_blocked_url_id( $blocked_url_id, $loaded_from_db = false ) {
		$this->set( 'blocked_url_id', $blocked_url_id, $loaded_from_db );
	}

	public function get_blocked_url_id() {
		return $this->get( 'blocked_url_id' );
	}

	public function get_updated() {
		return $this->get( 'updated' );
	}

	public function set_updated( $updated, $loaded_from_db = false ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function get_columns(): array {
		return array(
			'violated_directive' => '%s',
			'blocked_url_id'     => '%d',
			'blocked_url'        => '%s',
			'updated'            => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'violated_directive':
				return self::COLUMN_TYPE_ENUM;
			case 'updated':
				return self::COLUMN_TYPE_DATE;
		}
		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'violated_directive':
				return array(
					'default-src'     => 'default-src',
					'base-uri'        => 'base-uri',
					'child-src'       => 'child-src',
					'connect-src'     => 'connect-src',
					'font-src'        => 'font-src',
					'frame-src'       => 'frame-src',
					'img-src'         => 'img-src',
					'manifest-src'    => 'manifest-src',
					'media-src'       => 'media-src',
					'object-src'      => 'object-src',
					'script-src'      => 'script-src',
					'script-src-elem' => 'script-src-elem',
					'script-src-attr' => 'script-src-attr',
					'style-src'       => 'style-src',
					'style-src-elem'  => 'style-src-elem',
					'style-src-attr'  => 'style-src-attr',
					'worker-src'      => 'worker-src',
					'form-action'     => 'form-action',
				);
		}

		return parent::get_enum_column_items( $column );
	}

	public function get_table_name(): string {
		return URLSLAB_CSP_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'violated_directive', 'blocked_url_id' );
	}
}
