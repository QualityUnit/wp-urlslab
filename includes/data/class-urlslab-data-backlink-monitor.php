<?php

class Urlslab_Data_Backlink_Monitor extends Urlslab_Data {

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_from_url_id( $data['from_url_id'] ?? 0, $loaded_from_db );
		$this->set_to_url_id( $data['to_url_id'] ?? 0, $loaded_from_db );
		$this->set_created( $data['created'] ?? self::get_now(), $loaded_from_db );
		$this->set_updated( $data['updated'] ?? '', $loaded_from_db );
		$this->set_last_seen( $data['last_seen'] ?? '', $loaded_from_db );
		$this->set_anchor_text( $data['anchor_text'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? '', $loaded_from_db );
		$this->set_labels( $data['labels'] ?? '', $loaded_from_db );
		$this->set_note( $data['note'] ?? '', $loaded_from_db );
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

	public function get_table_name(): string {
		return URLSLAB_BACKLINK_MONITORS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'from_url_id', 'to_url_id' );
	}

	public function get_columns(): array {
		return array(
			'from_url_id' => '%d',
			'to_url_id'   => '%d',
			'created'     => '%s',
			'updated'     => '%s',
			'last_seen'   => '%s',
			'anchor_text' => '%s',
			'status'      => '%s',
			'labels'      => '%s',
			'note'      => '%s',
		);
	}
}
