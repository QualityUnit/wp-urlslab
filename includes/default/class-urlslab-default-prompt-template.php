<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;

class Urlslab_Default_Prompt_Template {

	private static $initial_data = array(
		array(
			'template_name' => 'Question Answering',
			'model_name' => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106,
			'prompt_template' => "Answer the following QUESTION based on the CONTEXT:\n\nCONTEXT:\n\n{context}\nQUESTION:\n\n{question}\n\nAnswer:",
			'prompt_type' => Urlslab_Data_Prompt_Template::ANSWERING_TASK_PROMPT_TYPE,
		),
		array(
			'template_name' => 'Blog Creation',
			'model_name' => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME__3_5_TURBO_1106,
			'prompt_template' => "Create a post based on the given CONTEXT with the title {title}. use {primary_keyword} as primary keyword and output should be in HTML \n\nCONTEXT:\n\n{context}\n",
			'prompt_type' => Urlslab_Data_Prompt_Template::BLOG_CREATION_TASK_PROMPT_TYPE,
		),
	);

	static function populate_prompt_template_table() {
		global $wpdb;
		$placeholder = array();
		$values = array();
		foreach ( self::$initial_data as $data ) {
			$values[] = $data['template_name'];
			$values[] = $data['model_name'];
			$values[] = $data['prompt_template'];
			$values[] = $data['prompt_type'];
			$values[] = Urlslab_Data::get_now();
			$placeholder[] = '(%s, %s, %s, %s, %s)';
		}
		$placeholder_string = implode( ', ', $placeholder );

		$wpdb->query(
			$wpdb->prepare(
				'INSERT IGNORE INTO ' . URLSLAB_PROMPT_TEMPLATE_TABLE . " (template_name, model_name, prompt_template, prompt_type, updated) VALUES {$placeholder_string}", //phpcs:ignore
				$values
			)
		);
	}

}
