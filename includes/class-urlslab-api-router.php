<?php
require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-modules.php';

class Urlslab_Api_Router {
	public function register_routes() {
		( new Urlslab_Api_Modules() )->register_routes();
	}
}
