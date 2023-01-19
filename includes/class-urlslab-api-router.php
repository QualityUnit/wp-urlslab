<?php

class Urlslab_Api_Router {
	public function register_routes() {
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-modules.php';
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-settings.php';

		( new Urlslab_Api_Modules() )->register_routes();
		( new Urlslab_Api_Settings() )->register_routes();
	}
}
