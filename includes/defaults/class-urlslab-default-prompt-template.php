<?php

use Urlslab_Vendor\OpenAPI\Client\Model\DomainDataRetrievalAugmentRequest;

class Urlslab_Default_Prompt_Template {

	private $initial_data = array(
		array(
			'template_name' => 'Summarization',
			'model_name' => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			'prompt_template' => 'Summarize the following context:\n\n{context}\n\nSummary:\n\n',
		),
		array(
			'template_name' => 'Question Answering',
			'model_name' => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			'prompt_template' => 'Answer the following QUESTION based on the CONTEXT:\n\nCONTEXT:\n\n{context}\n\QUESTION:\n\n{question}\n\nAnswer:',
		),
		array(
			'template_name' => 'Blog Creation',
			'model_name' => DomainDataRetrievalAugmentRequest::AUGMENTING_MODEL_NAME_GPT_3_5_TURBO,
			'prompt_template' => 'Create a post based on the given CONTEXT with the topic {topic} and output should be in HTML CONTEXT:\n\nCONTEXT:\n\n{context}\n',
		),
	);

	static function populate_prompt_template_table() {
		// TODO - finish populating the table
	}

}
