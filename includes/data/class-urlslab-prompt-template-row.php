<?php

class Urlslab_Prompt_Template_Row extends Urlslab_Data {

	public const SYSTEM_PROMPT_TYPE = 'S';
	public const USER_PROMPT_TYPE = 'U';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_template_id( $data['template_id'] ?? 0, $loaded_from_db );
		$this->set_template_name( $data['template_name'] ?? '', $loaded_from_db );
		$this->set_model_name( $data['model_name'] ?? '', $loaded_from_db );
		$this->set_prompt_template( $data['prompt_template'] ?? '', $loaded_from_db );
		$this->set_updated( empty( $data['updated'] ) ? self::get_now() : $data['updated'], $loaded_from_db );
		$this->set_prompt_type( $data['prompt_type'] ?? self::USER_PROMPT_TYPE, $loaded_from_db );
	}

	public function set_template_id( int $template_id, $loaded_from_db = false ) {
		$this->set( 'template_id', $template_id, $loaded_from_db );
	}

	public function set_template_name( string $template_name, $loaded_from_db = false ) {
		$this->set( 'template_name', $template_name, $loaded_from_db );
	}

	public function set_model_name( string $model_name, $loaded_from_db = false ) {
		$this->set( 'model_name', $model_name, $loaded_from_db );
	}

	public function set_prompt_template( string $prompt_template, $loaded_from_db = false ) {
		$this->set( 'prompt_template', $prompt_template, $loaded_from_db );
	}

	public function set_updated( string $updated, $loaded_from_db = false ) {
		$this->set( 'updated', $updated, $loaded_from_db );
	}

	public function set_prompt_type( string $prompt_type, $loaded_from_db = false ) {
		$this->set( 'prompt_type', $prompt_type, $loaded_from_db );
	}

	public function get_template_id(): int {
		return $this->get( 'template_id' );
	}

	public function get_template_name(): string {
		return $this->get( 'template_name' );
	}

	public function get_model_name(): string {
		return $this->get( 'model_name' );
	}

	public function get_prompt_template(): string {
		return $this->get( 'prompt_template' );
	}

	public function get_updated(): string {
		return $this->get( 'updated' );
	}

	public function get_prompt_type(): string {
		return $this->get( 'prompt_type' );
	}

	public function get_table_name(): string {
		return URLSLAB_PROMPT_TEMPLATE_TABLE;
	}

	public function has_autoincrement_primary_column(): bool {
		return true;
	}

	public function get_primary_columns(): array {
		return array( 'template_id' );
	}

	public function get_columns(): array {
		return array(
			'template_id'     => '%d',
			'template_name'   => '%s',
			'model_name'      => '%s',
			'prompt_template' => '%s',
			'prompt_type'     => '%s',
			'updated'         => '%s',
		);
	}
}


