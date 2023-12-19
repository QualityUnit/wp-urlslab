<?php

class Urlslab_Data_Faq extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_NEW = 'N';// not approved, but answerred
	public const STATUS_WAITING_FOR_APPROVAL = 'W';
	public const STATUS_PROCESSING = 'P';    //processing answer
	public const STATUS_EMPTY = 'E'; //not answerred yet
	public const STATUS_DISABLED = 'D'; //disabled from view

	/**
	 * @param mixed $loaded_from_db
	 */
	public function __construct( array $faq = array(), $loaded_from_db = true ) {
		$this->set_faq_id( (int) ( $faq['faq_id'] ?? 0 ), $loaded_from_db );
		$this->set_question( $faq['question'] ?? '', $loaded_from_db );
		$this->set_answer( $faq['answer'] ?? '', $loaded_from_db );
		$this->set_language( $faq['language'] ?? 'all', $loaded_from_db );
		$this->set_updated( empty( $faq['updated'] ) ? self::get_now() : $faq['updated'], $loaded_from_db );
		$this->set_labels( $faq['labels'] ?? '', $loaded_from_db );
		if ( empty( $faq['status'] ) ) {
			if ( strlen( $this->get_answer() ) ) {
				$this->set_status( self::STATUS_NEW, $loaded_from_db );
			} else {
				$this->set_status( self::STATUS_EMPTY, $loaded_from_db );
			}
		} else {
			$this->set_status( $faq['status'], $loaded_from_db );
		}
	}

	public function get_faq_id(): int {
		return $this->get( 'faq_id' );
	}

	public function get_question(): string {
		return $this->get( 'question' );
	}

	public function get_answer(): string {
		return $this->get( 'answer' );
	}

	public function get_language(): string {
		return $this->get( 'language' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_status(): string {
		return $this->get( 'status' );
	}

	public function get_labels(): string {
		return $this->get( 'labels' );
	}

	public function set_faq_id( int $faq_id, $loaded_from_db = false ) {
		$this->set( 'faq_id', $faq_id, $loaded_from_db );
	}

	public function set_question( string $question, $loaded_from_db = false ) {
		$this->set( 'question', $question, $loaded_from_db );
	}

	public function set_answer( string $answer, $loaded_from_db = false ) {
		$this->set( 'answer', $answer, $loaded_from_db );
	}

	public function set_language( string $language, $loaded_from_db = false ) {
		$this->set( 'language', $language, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false ) {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
	}

	protected function set( $name, $value, $loaded_from_db ) {
		parent::set( $name, $value, $loaded_from_db );
		if ( ! $loaded_from_db && 'updated' !== $name && $this->has_changed( $name ) ) {
			$this->set_updated( self::get_now(), $loaded_from_db );
		}
	}

	public function get_table_name(): string {
		return URLSLAB_FAQS_TABLE;
	}

	public function get_primary_columns(): array {
		return array( 'faq_id' );
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_columns(): array {
		return array(
			'faq_id'   => '%d',
			'question' => '%s',
			'answer'   => '%s',
			'language' => '%s',
			'updated'  => '%s',
			'status'   => '%s',
			'labels'   => '%s',
		);
	}

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'updated':
				return self::COLUMN_TYPE_DATE;
		}

		if ( 'status' === $column ) {
			return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_menu_column_items( string $column ): array {
		if ( 'status' === $column ) {
			return array(
				self::STATUS_ACTIVE               => __( 'Active', 'urlslab' ),
				self::STATUS_NEW                  => __( 'New - answered', 'urlslab' ),
				self::STATUS_EMPTY                => __( 'New - missing answer', 'urlslab' ),
				self::STATUS_WAITING_FOR_APPROVAL => __( 'Awaiting approval', 'urlslab' ),
				self::STATUS_PROCESSING           => __( 'Processing answer', 'urlslab' ),
				self::STATUS_DISABLED             => __( 'Disabled', 'urlslab' ),
			);
		}

		return parent::get_menu_column_items( $column );
	}
}
