<?php

class Urlslab_Api_Router {
	public function register_routes() {
		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-table.php';

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-languages.php';
		( new Urlslab_Api_Languages() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-modules.php';
		( new Urlslab_Api_Modules() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-settings.php';
		( new Urlslab_Api_Settings() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-youtube-cache.php';
		( new Urlslab_Api_Youtube_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-css-cache.php';
		( new Urlslab_Api_Css_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-content-cache.php';
		( new Urlslab_Api_Content_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-cron.php';
		( new Urlslab_Api_Cron() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-keywords.php';
		( new Urlslab_Api_Keywords() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-files.php';
		( new Urlslab_Api_Files() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-content-generators.php';
		( new Urlslab_Api_Content_Generators() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-urls.php';
		( new Urlslab_Api_Urls() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-screenshots.php';
		( new Urlslab_Api_Screenshots() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-meta-tags.php';
		( new Urlslab_Api_Meta_Tags() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-url-relations.php';
		( new Urlslab_Api_Url_Relations() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-search-replace.php';
		( new Urlslab_Api_Search_Replace() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-schedules.php';
		( new Urlslab_Api_Schedules() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-not-found-log.php';
		( new Urlslab_Api_Not_Found_Log() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-redirects.php';
		( new Urlslab_Api_Redirects() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-labels.php';
		( new Urlslab_Api_Labels() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-optimize.php';
		( new Urlslab_Api_Optimize() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-billing.php';
		( new Urlslab_Api_Billing() )->register_routes();
	}
}
