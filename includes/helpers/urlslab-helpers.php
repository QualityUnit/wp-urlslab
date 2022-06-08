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

function urlslab_get_url_description( $summary, $meta_description, $title, $url ) {
	if ( strlen( trim( $summary ) ) ) {
		return $summary;
	} elseif ( strlen( trim( $meta_description ) ) ) {
		return $meta_description;
	} elseif ( strlen( trim( $title ) ) ) {
		return $title;
	}

	return trim( str_replace( '/', ' ', parse_url( $url, PHP_URL_PATH ) ) );
}

function urlslab_is_same_domain_url( $url ): bool {
	$url_host_name = strtolower( parse_url( $url, PHP_URL_HOST ) );
	if ( ! strlen( $url_host_name ) ) {
		return true;
	}

	return strtolower( parse_url( get_site_url(), PHP_URL_HOST ) ) == $url_host_name;
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
