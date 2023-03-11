<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Screenshot_Cron extends Urlslab_Cron {


	public function __construct() {
		parent::__construct();
	}

	protected function execute(): bool {
		return false;
	}

}
