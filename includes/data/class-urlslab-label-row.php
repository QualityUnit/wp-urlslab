<?php

class Urlslab_Label_Row extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $redirect = array(), $loaded_from_db = true ) {
		$this->set_label_id( $redirect['label_id'] ?? 0, $loaded_from_db );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'label_id'   => '%d',
			'name'   => '%s',
			'bgcolor'   => '%s',
			'modules'   => '%s',
		);
	}

	public function get_table_name(): string {
		return URLSLAB_LABELS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'label_id' );
	}
}
