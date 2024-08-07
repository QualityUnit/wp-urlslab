<?php

class Urlslab_Data_Prompt_Template extends Urlslab_Data {

	public const BLOG_CREATION_TASK_PROMPT_TYPE = 'B';
	public const ANSWERING_TASK_PROMPT_TYPE     = 'A';

	public function __construct( array $data = array(), $loaded_from_db = true ) {
		$this->set_template_id( $data['template_id'] ?? 0, $loaded_from_db );
		$this->set_template_name( $data['template_name'] ?? '', $loaded_from_db );
		$this->set_model_name( $data['model_name'] ?? '', $loaded_from_db );
		$this->set_prompt_template( $data['prompt_template'] ?? '', $loaded_from_db );
		$this->set_updated( empty( $data['updated'] ) ? self::get_now() : $data['updated'], $loaded_from_db );
		$this->set_prompt_type( $data['prompt_type'] ?? self::BLOG_CREATION_TASK_PROMPT_TYPE, $loaded_from_db );
	}

	public static function get_all_prompt_types(): array {
		return array(
			self::BLOG_CREATION_TASK_PROMPT_TYPE,
			self::ANSWERING_TASK_PROMPT_TYPE,
		);
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

	public function get_column_type( string $column, $format ) {
		switch ( $column ) {
			case 'updated':
				return self::COLUMN_TYPE_DATE;
			case 'prompt_type':
			case 'model_name':
				return self::COLUMN_TYPE_ENUM;
		}

		return parent::get_column_type( $column, $format );
	}

	public function get_enum_column_items( string $column ): array {
		switch ( $column ) {
			case 'prompt_type':
				return array(
					self::BLOG_CREATION_TASK_PROMPT_TYPE => __( 'Blog generation', 'urlslab' ),
					self::ANSWERING_TASK_PROMPT_TYPE     => __( 'Question answering', 'urlslab' ),
				);
			case 'model_name':
				return array(
					\Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequestWithURLContext::MODE_NAME__3_5_TURBO_1106 => __( 'OpenAI GPT 3.5 Turbo 16K', 'urlslab' ),
					\Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequestWithURLContext::MODE_NAME__4_1106_PREVIEW => __( 'OpenAI GPT 4 Turbo 128K', 'urlslab' ),
				);
		}

		return parent::get_enum_column_items( $column );
	}
}
