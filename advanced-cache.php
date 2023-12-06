<?php

if (
	isset( $_SERVER['REQUEST_METHOD'] ) &&
	'GET' === $_SERVER['REQUEST_METHOD'] &&
	(
		! isset( $_SERVER['HTTP_COOKIE'] ) ||
		! preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['HTTP_COOKIE'] )
	) &&
	(
		! isset( $_SERVER['REQUEST_URI'] ) ||
		! preg_match( '/(comment_author|wp-postpass|logged|wptouch_switch_toggle)/', $_SERVER['REQUEST_URI'] )
	)
) {

	if (
		defined( 'WP_CACHE' ) &&
		WP_CACHE &&
		isset( $_SERVER['UL_FINAL'] )
	) {
		if ( ! empty( $_SERVER['UL_QS'] ) ) {
			$params = md5( $_SERVER['UL_QS'] );
			preg_replace( '/\.html$/', $params . '.html', $_SERVER['UL_FINAL'] );
		}

		if ( is_file( $_SERVER['UL_FINAL'] ) ) {
			header( 'X-URLSLAB-CACHE:hit' );
			$fp = fopen( $_SERVER['UL_FINAL'], 'rb' );
			if ( $fp ) {
				fpassthru( $fp );
				die();
			}
		}
	}


	if ( isset( $_SERVER['URLSLAB_UPL'] ) ) {
		function urlslab_get_visitor_ip(): string {
			if ( getenv( 'HTTP_CF_CONNECTING_IP' ) ) {
				return getenv( 'HTTP_CF_CONNECTING_IP' );
			}
			if ( getenv( 'HTTP_CLIENT_IP' ) ) {
				return getenv( 'HTTP_CLIENT_IP' );
			}
			if ( getenv( 'HTTP_X_FORWARDED_FOR' ) ) {
				return getenv( 'HTTP_X_FORWARDED_FOR' );
			}
			if ( getenv( 'HTTP_X_FORWARDED' ) ) {
				return getenv( 'HTTP_X_FORWARDED' );
			}
			if ( getenv( 'HTTP_FORWARDED_FOR' ) ) {
				return getenv( 'HTTP_FORWARDED_FOR' );
			}
			if ( getenv( 'HTTP_FORWARDED' ) ) {
				return getenv( 'HTTP_FORWARDED' );
			}
			if ( getenv( 'HTTP_X_REAL_IP' ) ) {
				return getenv( 'HTTP_X_REAL_IP' );
			}
			if ( getenv( 'REMOTE_ADDR' ) ) {
				return getenv( 'REMOTE_ADDR' );
			}

			return '';
		}

		$ip = urlslab_get_visitor_ip();
		if ( ! empty( $ip ) ) {
			$file_name = $_SERVER['URLSLAB_UPL'] . md5( $ip ) . '_lock.html';
			if ( is_file( $file_name ) ) {
				$time = file_get_contents( $file_name );
				if ( 0 < $time - time() ) {
					// remove header
					header_remove( 'ETag' );
					header_remove( 'Pragma' );
					header_remove( 'Cache-Control' );
					header_remove( 'Last-Modified' );
					header_remove( 'Expires' );
					header( 'Expires: Thu, 1 Jan 1970 00:00:00 GMT' );
					header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
					header( 'Cache-Control: post-check=0, pre-check=0', false );
					header( 'Pragma: no-cache' );
					echo 'IP blocked';
					die();
				} else {
					unlink( $file_name );
				}
			}
		}
	}

}