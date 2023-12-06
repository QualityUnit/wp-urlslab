<?php

class Urlslab_Tool_Config {

	public static function init_advanced_cache() {
		return self::init_advanced_cache_file() && self::init_wp_cache_define();
	}

	public static function clear_advanced_cache() {
		return self::clear_advanced_cache_file() && self::clear_wp_cache_define();
	}


	private static function init_wp_cache_define(): bool {
		if ( defined( 'WP_CACHE' ) && WP_CACHE ) {
			return true;
		}

		$wp_config = ABSPATH . 'wp-config.php';
		if ( file_exists( $wp_config ) ) {
			$wp_config_content = file_get_contents( $wp_config );
			if ( preg_match( '/^\s*define\(\s*\'WP_CACHE\'\s*,\s*(?<value>[^\s\)]*)\s*\)/m', $wp_config_content, $matches ) ) {
				if ( ! empty( $matches['value'] ) && $matches['value'] === 'true' ) {
					return true;
				} else {
					//define in config, but deactivated, replace value false with true
					$wp_config_content = preg_replace( '/^\s*define\(\s*\'WP_CACHE\'\s*,\s*([^\s\)]*)\s*\).+/m', "define( 'WP_CACHE', true );", $wp_config_content );

					return false !== file_put_contents( $wp_config, $wp_config_content );
				}
			} else {
				//define not in config file, add it to the beginning of the file
				$wp_config_content = preg_replace( '/(<\?php)/i', "<?php\r\ndefine( 'WP_CACHE', true );\r\n", $wp_config_content );

				return false !== file_put_contents( $wp_config, $wp_config_content );
			}
		}

		return false;
	}

	private static function clear_wp_cache_define(): bool {
		if ( ! defined( 'WP_CACHE' ) || ! WP_CACHE ) {
			return true;
		}

		$wp_config = ABSPATH . 'wp-config.php';
		if ( file_exists( $wp_config ) ) {
			$wp_config_content = file_get_contents( $wp_config );
			if ( preg_match( '/^\s*define\(\s*\'WP_CACHE\'\s*,\s*(?<value>[^\s\)]*)\s*\)/m', $wp_config_content, $matches ) ) {
				if ( ! empty( $matches['value'] ) ) {
					//define in config, but deactivated, replace value false with true
					$wp_config_content = preg_replace( '/^\s*define\(\s*\'WP_CACHE\'\s*,\s*([^\s\)]*)\s*\).+/m', "define( 'WP_CACHE', false );", $wp_config_content );

					return false !== file_put_contents( $wp_config, $wp_config_content );
				}
			}
		}

		return true;
	}

	private static function init_advanced_cache_file(): bool {
		$advanced_cache_plugin_file = URLSLAB_PLUGIN_DIR . 'advanced-cache.php';
		if ( file_exists( WP_CONTENT_DIR . '/advanced-cache.php' ) ) {
			//check if urlslab advanced-cache.php is included
			$advanced_cache_content = file_get_contents( WP_CONTENT_DIR . '/advanced-cache.php' );
			if ( preg_match( '/require_once\\s+?\'' . preg_quote( $advanced_cache_plugin_file, '/' ) . '\'/m', $advanced_cache_content ) ) {
				//file exists and urlslab advanced-cache.php is included
				return true;
			} else {
				//include urlslab advanced-cache.php
				if ( empty( trim( $advanced_cache_content ) ) || false === strpos( $advanced_cache_content, '<?php' ) ) {
					$advanced_cache_content = "<?php";
				}
				$advanced_cache_content = preg_replace( '/(<\?php)/i', "<?php\r\nrequire_once '" . $advanced_cache_plugin_file . "';\r\n", $advanced_cache_content );

				return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', $advanced_cache_content );
			}
		} else {
			//doesn't exists, create it and include advanced-cache.php from urlslab plugin
			$advanced_cache_content = "<?php\r\nrequire_once '" . $advanced_cache_plugin_file . "';\r\n";

			return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', $advanced_cache_content );
		}
	}

	private static function clear_advanced_cache_file(): bool {
		if ( file_exists( WP_CONTENT_DIR . '/advanced-cache.php' ) ) {
			$advanced_cache_plugin_file = URLSLAB_PLUGIN_DIR . 'advanced-cache.php';
			$advanced_cache_content     = file_get_contents( WP_CONTENT_DIR . '/advanced-cache.php' );
			if ( preg_match( '/^(.*)require_once\\s+?\'' . preg_quote( $advanced_cache_plugin_file, '/' ) . '\';(.*)$/m', $advanced_cache_content, $matches ) ) {
				//urlslab advanced-cache.php is included, remove it
				$advanced_cache_content = $matches[1] . $matches[2];

				return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', $advanced_cache_content );
			}
		}

		return true;
	}

}