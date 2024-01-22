<?php
define( 'URLSLAB_ADVANCED_CACHE', true );

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
	if ( isset( $_SERVER['UL_UPL'] ) ) {
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
			$file_name = $_SERVER['UL_UPL'] . '/urlslab/' . md5( $ip ) . '_lock.html';
			if ( is_file( $file_name ) ) {
				$time = file_get_contents( $file_name );
				if ( is_numeric( $time ) && $time > time() ) {
					// remove header
					header_remove();
					@header( 'HTTP/1.1 429 Too Many Requests' );
					@header( 'Expires: Thu, 1 Jan 1970 00:00:00 GMT' );
					@header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
					@header( 'Cache-Control: post-check=0, pre-check=0', false );
					@header( 'Pragma: no-cache' );
					echo 'IP blocked';
					die();
				} else {
					unlink( $file_name );
				}
			}
		}
	}
}
