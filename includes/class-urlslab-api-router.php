<?php

class Urlslab_Api_Router {
	public function register_routes() {
		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-table.php';

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-cache-rules.php';
		( new Urlslab_Api_Cache_Rules() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-modules.php';
		( new Urlslab_Api_Modules() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-settings.php';
		( new Urlslab_Api_Settings() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-youtube-cache.php';
		( new Urlslab_Api_Youtube_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-css-cache.php';
		( new Urlslab_Api_Css_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-js-cache.php';
		( new Urlslab_Api_Js_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-content-cache.php';
		( new Urlslab_Api_Content_Cache() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-cron.php';
		( new Urlslab_Api_Cron() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-keywords.php';
		( new Urlslab_Api_Keywords() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-files.php';
		( new Urlslab_Api_Files() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-generators.php';
		( new Urlslab_Api_Generators() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-prompt-template.php';
		( new Urlslab_Api_Prompt_Template() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-shortcodes.php';
		( new Urlslab_Api_Shortcodes() )->register_routes();

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

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-faq.php';
		( new Urlslab_Api_Faq() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-faq-urls.php';
		( new Urlslab_Api_Faq_Urls() )->register_routes();

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

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-permissions.php';
		( new Urlslab_Api_Permissions() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-custom-html.php';
		( new Urlslab_Api_Custom_Html() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-serp-queries.php';
		( new Urlslab_Api_Serp_Queries() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-serp-urls.php';
		( new Urlslab_Api_Serp_Urls() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-serp-domains.php';
		( new Urlslab_Api_Serp_Domains() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-gsc-sites.php';
		( new Urlslab_Api_Gsc_Sites() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-serp-gap.php';
		( new Urlslab_Api_Serp_Gap() )->register_routes();

		require_once URLSLAB_PLUGIN_DIR . 'includes/api/class-urlslab-api-process.php';
		( new Urlslab_Api_Process() )->register_routes();

	}
}
