<?php

class Urlslab_Data_Backlink_Monitor extends Urlslab_Data {

	public const STATUS_NOT_CHECKED = 'N';
	public const STATUS_OK = 'O';
	public const STATUS_MISSING = 'M';

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_from_url_id( $data['from_url_id'] ?? 0, $loaded_from_db );
		$this->set_to_url_id( $data['to_url_id'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_updated( $data['updated'] ?? '', $loaded_from_db );
		$this->set_last_seen( $data['last_seen'] ?? '', $loaded_from_db );
		$this->set_first_seen( $data['first_seen'] ?? '', $loaded_from_db );
		$this->set_anchor_text( $data['anchor_text'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_NOT_CHECKED, $loaded_from_db );
		$this->set_labels( $data['labels'] ?? '', $loaded_from_db );
		$this->set_note( $data['note'] ?? '', $loaded_from_db );
		$this->set_link_attributes( $data['link_attributes'] ?? '', $loaded_from_db );
	}

	public function set_from_url_id( int $from_url_id, $loaded_from_db = false ): void {
		$this->set( 'from_url_id', $from_url_id, $loaded_from_db );
	}

	public function get_from_url_id(): int {
		return $this->get( 'from_url_id' );
	}

	public function set_to_url_id( int $to_url_id, $loaded_from_db = false ): void {
		$this->set( 'to_url_id', $to_url_id, $loaded_from_db );
	}

	public function get_to_url_id(): int {
		return $this->get( 'to_url_id' );
	}

	public function set_created( string $created, $loaded_from_db = false ): void {
		$this->set( 'created', $created, $loaded_from_db );
	}

	public function get_created(): string {
		return $this->get( 'created' );
	}

	public function set_updated( string $updated, $loaded_from_db = false ): void {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function set_last_seen( string $last_seen, $loaded_from_db = false ): void {
		$this->set( 'last_seen', $last_seen, $loaded_from_db );
	}

	public function get_last_seen(): string {
		return $this->get( 'last_seen' );
	}

	public function set_first_seen( string $first_seen, $loaded_from_db = false ): void {
		$this->set( 'first_seen', $first_seen, $loaded_from_db );
	}

	public function get_first_seen(): string {
		return $this->get( 'first_seen' );
	}

	public function set_anchor_text( string $anchor_text, $loaded_from_db = false ): void {
		$this->set( 'anchor_text', $anchor_text, $loaded_from_db );
	}

	public function get_anchor_text(): string {
		return $this->get( 'anchor_text' );
	}

	public function set_status( string $status, $loaded_from_db = false ): void {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_note( string $note, $loaded_from_db = false ): void {
		$this->set( 'note', $note, $loaded_from_db );
	}

	public function get_note(): string {
		return $this->get( 'note' );
	}

	public function set_link_attributes( string $link_attributes, $loaded_from_db = false ): void {
		$this->set( 'link_attributes', trim( $link_attributes ), $loaded_from_db );
	}

	public function get_link_attributes(): string {
		return $this->get( 'link_attributes' );
	}

	public function get_table_name(): string {
		return URLSLAB_BACKLINK_MONITORS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'from_url_id', 'to_url_id' );
	}

	public function get_columns(): array {
		return array(
			'from_url_id'     => '%d',
			'to_url_id'       => '%d',
			'created'         => '%s',
			'updated'         => '%s',
			'last_seen'       => '%s',
			'first_seen'      => '%s',
			'anchor_text'     => '%s',
			'status'          => '%s',
			'labels'          => '%s',
			'note'            => '%s',
			'link_attributes' => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'last_seen':
			case 'first_seen':
				return Urlslab_Data::COLUMN_TYPE_DATE;
			case 'status':
			case 'from_http_status':
				return self::COLUMN_TYPE_ENUM;
			default:
				return parent::get_column_type( $column, $format );
		}
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'status':
				return array(
					self::STATUS_NOT_CHECKED => __( 'Waiting', 'wp-urlslab' ),
					self::STATUS_OK          => __( 'OK', 'wp-urlslab' ),
					self::STATUS_MISSING     => __( 'Missing', 'wp-urlslab' ),
				);
			case 'from_http_status':
				return Urlslab_Data_Url::httpStatus();
		}

		return parent::get_enum_column_items( $column );
	}
}
