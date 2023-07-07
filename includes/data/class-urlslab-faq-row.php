<?php

class Urlslab_Faq_Row extends Urlslab_Data {
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
		$this->set_faq_id( $faq['faq_id'] ?? 0, $loaded_from_db );
		$this->set_question( $faq['question'] ?? '', $loaded_from_db );
		$this->set_answer( $faq['answer'] ?? '', $loaded_from_db );
		$this->set_language( $faq['language'] ?? '', $loaded_from_db );
		$this->set_updated( $faq['updated'] ?? self::get_now(), $loaded_from_db );
		$this->set_status( $faq['status'] ?? (empty($this->get_answer()) ? self::STATUS_EMPTY : self::STATUS_NEW), $loaded_from_db );
		$this->set_labels( $faq['labels'] ?? '', $loaded_from_db );
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

	public function set_faq_id( int $faq_id, $loaded_from_db = false  ) {
		$this->set( 'faq_id', $faq_id, $loaded_from_db );
	}

	public function set_question( string $question, $loaded_from_db = false  ) {
		$this->set( 'question', $question, $loaded_from_db );
	}

	public function set_answer( string $answer, $loaded_from_db = false  ) {
		$this->set( 'answer', $answer, $loaded_from_db );
	}

	public function set_language( string $language, $loaded_from_db = false  ) {
		$this->set( 'language', $language, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false  ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_status( string $status, $loaded_from_db = false  ) {
		$this->set( 'status', $status, $loaded_from_db );
	}

	public function set_labels( string $labels, $loaded_from_db = false ): void {
		$this->set( 'labels', $labels, $loaded_from_db );
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
}
