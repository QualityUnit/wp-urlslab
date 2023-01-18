<?php
require_once URLSLAB_PLUGIN_DIR . 'admin/includes/api/class-urlslab-api-modules.php';

class Urlslab_Api_Router {
	public function register_routes() {
//		$urlslab->get_loader()->add_action( 'wp_ajax_urlslab_exec_cron', $urlslab, 'execute_cron_tasks' );
//		$urlslab->get_loader()->add_action( 'wp_ajax_urlslab_exec_restart_url_scanning', $this, 'urlslab_exec_restart_url_scanning' );
		(new Urlslab_Api_Modules())->register_routes();
	}

//	public function urlslab_exec_restart_url_scanning() {
//		update_option( Urlslab_Link_Enhancer::SETTING_NAME_LAST_LINK_VALIDATION_START, Urlslab_Data::get_now() );
//	}

}
