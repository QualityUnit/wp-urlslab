<?php

function get_action() {
	$current_action = '';
	if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
		$current_action = $_REQUEST['action'];
	}
	return $current_action;
}

function urlslab_admin_menu_page_url( $menu_slug = '' ): string {
	if ( empty( $menu_slug ) ) {
		$menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
	}
	return admin_url() . 'admin.php?page=' . urlencode( $menu_slug );
}

function urlslab_is_same_domain_url( $url ): bool {
	$url_host_name = strtolower( parse_url( $url, PHP_URL_HOST ) );
	if ( ! strlen( $url_host_name ) ) {
		return true;
	}

	return strtolower( parse_url( get_site_url(), PHP_URL_HOST ) ) == $url_host_name;
}

function get_current_page_url(): Urlslab_Url {
	$current_url = get_permalink( get_the_ID() );
	if ( is_category() ) {
		$current_url = get_category_link( get_query_var( 'cat' ) );
	}
	return new Urlslab_Url( $current_url );
}

function urlslab_get_current_page_protocol(): string {
	$protocol = parse_url( get_site_url(), PHP_URL_SCHEME );
	if ( empty( $protocol ) ) {
		return 'http://';
	}
	return $protocol . '://';
}

function urlslab_get_language() {
	global $sitepress, $polylang;

	if ( ! empty( $sitepress ) && is_object( $sitepress ) && method_exists( $sitepress, 'get_active_languages' ) ) {
		return apply_filters( 'wpml_current_language', null );
	}

	if ( ! empty( $polylang ) && function_exists( 'pll_current_language' ) && strlen( pll_current_language() ) ) {
		return pll_current_language();
	}

	return substr( get_locale(), 0, 2 );
}

function urlslab_debug_log( Exception $e ) {
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
		// phpcs:disable WordPress.PHP.DevelopmentFunctions
		error_log( $e->getTraceAsString(), 3, URLSLAB_PLUGIN_LOG );
		// phpcs:enable
	}
}

function urlslab_status_ui_convert( string $status_char ): string {
	switch ( $status_char ) {
		case Urlslab_Status::$available:
			return '<div class="status-circle background-success" title="available"></div>';
		case Urlslab_Status::$pending:
			return '<div class="status-circle background-warning" title="pending"></div>';
		case Urlslab_Status::$not_scheduled:
			return '<div class="status-circle background-secondary" title="not-scheduled"></div>';
		case Urlslab_Status::$not_crawling:
			return '<div class="status-circle background-danger" title="broken"></div>';
		case Urlslab_Status::$blocked:
			return '<div class="status-circle background-danger" title="blocked"></div>';
		case Urlslab_Status::$recurring_update:
			return '<div class="status-circle background-primary" title="updating"></div>';
		default:
			return $status_char;
	}
}
