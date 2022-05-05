<?php

function get_action() {
	$current_action = '';
	if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
		$current_action = $_REQUEST['action'];
	}
	return $current_action;
}

function urlslab_admin_menu_page_url( $menu_slug ): string {
	return admin_url() . 'admin.php?page=' . urlencode( $menu_slug );
}
