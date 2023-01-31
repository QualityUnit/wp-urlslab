<?php

class Urlslab_Api_Router {
	public function register_routes() {
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-modules.php';
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-settings.php';
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-youtube-cache.php';
		require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-css-cache.php';

		( new Urlslab_Api_Modules() )->register_routes();
		( new Urlslab_Api_Settings() )->register_routes();
		( new Urlslab_Api_Youtube_Cache() )->register_routes();
		( new Urlslab_Api_Css_Cache() )->register_routes();
	}
}
