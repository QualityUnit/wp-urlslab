<?php

class Urlslab_Faq_Cron extends Urlslab_Cron {

	public function __construct() {
		parent::__construct();
	}

	public function get_description(): string {
		return __( 'Generating answer to FAQ Questions', 'urlslab' );
	}

	protected function execute(): bool {
		// TODO: Implement execute() method.
	}
}
