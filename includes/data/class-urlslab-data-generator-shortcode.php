<?php

class Urlslab_Data_Generator_Shortcode extends Urlslab_Data {
	public const STATUS_ACTIVE = 'A';
	public const STATUS_DISABLED = 'D';

	public const TYPE_SEMANTIC_SEARCH_CONTEXT = 'S';
	public const TYPE_VIDEO = 'V';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_shortcode_id( $data['shortcode_id'] ?? 0, $loaded_from_db );
		$this->set_semantic_context( $data['semantic_context'] ?? '', $loaded_from_db );
		$this->set_prompt( $data['prompt'] ?? '', $loaded_from_db );
		$this->set_default_value( $data['default_value'] ?? '', $loaded_from_db );
		$this->set_url_filter( $data['url_filter'] ?? '', $loaded_from_db );
		$this->set_status( $data['status'] ?? self::STATUS_ACTIVE, $loaded_from_db );
		$this->set_shortcode_type( $data['shortcode_type'] ?? self::TYPE_SEMANTIC_SEARCH_CONTEXT, $loaded_from_db );
		$this->set_date_changed( $data['date_changed'] ?? self::get_now(), $loaded_from_db );
		$this->set_model( $data['model'] ?? '', $loaded_from_db );
		$this->set_template( $data['template'] ?? '', $loaded_from_db );
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

	public function get_semantic_context(): string {
		return $this->get( 'semantic_context' );
	}

	public function set_semantic_context( string $semantic_context, $loaded_from_db = false ): void {
		$this->set( 'semantic_context', $semantic_context, $loaded_from_db );
	}

	public function get_prompt(): string {
		return $this->get( 'prompt' );
	}

	public function set_prompt( string $prompt, $loaded_from_db = false ): void {
		$this->set( 'prompt', $prompt, $loaded_from_db );
	}

	public function get_template(): string {
		return $this->get( 'template' );
	}

	public function set_template( string $template, $loaded_from_db = false ): void {
		$this->set( 'template', $template, $loaded_from_db );
	}

	public function get_default_value(): string {
		return $this->get( 'default_value' );
	}

	public function set_default_value( string $default_value, $loaded_from_db = false ): void {
		$this->set( 'default_value', $default_value, $loaded_from_db );
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
	}


	public function get_shortcode_type(): string {
		return $this->get( 'shortcode_type' );
	}

	public function set_shortcode_type( string $shortcode_type, $loaded_from_db = false ): void {
		$this->set( 'shortcode_type', $shortcode_type, $loaded_from_db );
	}

	public function get_date_changed(): string {
		return $this->get( 'date_changed' );
	}

	public function set_date_changed( string $date_changed, $loaded_from_db = false ): void {
		$this->set( 'date_changed', $date_changed, $loaded_from_db );
	}

	public function get_model(): string {
		return $this->get( 'model' );
	}

	public function set_model( string $model, $loaded_from_db = false ): void {
		$this->set( 'model', $model, $loaded_from_db );
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
			'semantic_context' => '%s',
			'prompt'           => '%s',
			'default_value'    => '%s',
			'url_filter'       => '%s',
			'model'            => '%s',
			'template'         => '%s',
			'status'           => '%s',
			'shortcode_type'   => '%s',
			'date_changed'     => '%s',
		);
	}

	public function is_active(): bool {
		return self::STATUS_ACTIVE === $this->get_status();
	}

}
