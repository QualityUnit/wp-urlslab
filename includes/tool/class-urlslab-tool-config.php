<?php

class Urlslab_Tool_Config {

	public static function init_advanced_cache() {
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Cache::SLUG ) ) {
			return self::init_advanced_cache_file() && self::init_wp_cache_define();
		}

		return true;
	}

	public static function clear_advanced_cache() {
		return self::clear_advanced_cache_file() && self::clear_wp_cache_define();
	}

	public static function get_status(): string {
		$status = '';
		if ( defined( 'WP_CACHE' ) && WP_CACHE ) {
			$status .= '<br/><br/>' . __( 'WP_CACHE set to true.', 'wp-urlslab' );
		} else {
			$wp_config = self::get_config_file_name();
			if ( is_writable( $wp_config ) ) {
				$status .= '<br/><br/>' . sprintf( __( 'WP_CACHE is not defined yet in `%s`. Plugin can activate it automatically.', 'wp-urlslab' ), $wp_config );
			} else {
				$status .= '<br/><br/>' . sprintf( __( 'Config file `%s` is not writable. Make it writable or set define WP_CACHE to true by adding following line:', 'wp-urlslab' ), $wp_config );
				$status .= "<br/><br/><code>define('WP_CACHE', true);</code>";
			}
		}

		$advanced_cache_file = WP_CONTENT_DIR . '/advanced-cache.php';
		if ( ! defined( 'URLSLAB_ADVANCED_CACHE' ) ) {
			if ( file_exists( $advanced_cache_file ) ) {
				$advanced_cache_content = file_get_contents( $advanced_cache_file );
				if ( preg_match( '/require_once\\s+?\\(\\s+?\'' . preg_quote( URLSLAB_PLUGIN_DIR . 'advanced-cache.php', '/' ) . '\'\\s+?\\)/m', $advanced_cache_content ) ) {
					$status .= '<br/><br/>' . __( 'Advanced cache is activated.', 'wp-urlslab' );
				} else if ( is_writable( $advanced_cache_file ) ) {
					$status .= '<br/><br/>' . sprintf( __( 'Advanced cache is not activated. Plugin can activate it.', 'wp-urlslab' ), $advanced_cache_file, URLSLAB_PLUGIN_DIR . 'advanced-cache.php' );
				} else {
					$status .= '<br/><br/>' . sprintf( __( 'Advanced cache is not activated. Add to `%s` following to at the beginning of file:', 'wp-urlslab' ), $advanced_cache_file );
					$status .= "<br/><br/><code>require_once( '" . URLSLAB_PLUGIN_DIR . "advanced-cache.php' );</code>";
				}
			} else {
				if ( is_writable( WP_CONTENT_DIR ) ) {
					$status .= '<br/><br/>' . sprintf( __( '`%1$s` is not created yet. Plugin can create it.', 'wp-urlslab' ), $advanced_cache_file );
				} else {
					$status .= '<br/><br/>' . sprintf( __( 'Advanced cache file (`%1$s`) is not writable. Make it writable or add to `%2$s` following to at the beginning of file:', 'wp-urlslab' ), $advanced_cache_file, $advanced_cache_file );
					$status .= "<br/><br/><code>require_once( '" . URLSLAB_PLUGIN_DIR . "advanced-cache.php' );</code>";
				}
			}
		}

		return $status;
	}

	private static function init_wp_cache_define(): bool {
		if ( defined( 'WP_CACHE' ) && WP_CACHE ) {
			return true;
		}

		$wp_config = self::get_config_file_name();
		if ( file_exists( $wp_config ) ) {
			$wp_config_content = file_get_contents( $wp_config );
			if ( preg_match( '/^\s*define\\(\s*\'WP_CACHE\'\s*,\s*(?<value>[^\s\)]*)\s*\\)/m', $wp_config_content, $matches ) ) {
				if ( ! empty( $matches['value'] ) && 'true' === $matches['value'] ) {
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

	public static function get_config_file_name() {
		if ( ! function_exists( 'WP_Filesystem' ) && is_file( ABSPATH . '/wp-admin/includes/file.php' ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}
		/** @var WP_Filesystem_Base $wp_filesystem */
		global $wp_filesystem;

		if ( $wp_filesystem ) {
			if ( file_exists( $wp_filesystem->abspath() . 'wp-config.php' ) ) {
				return $wp_filesystem->abspath() . 'wp-config.php';
			} else if ( file_exists( dirname( $wp_filesystem->abspath() ) . '/wp-config.php' ) ) {
				return dirname( $wp_filesystem->abspath() ) . '/wp-config.php';
			}
		}

		return ABSPATH . 'wp-config.php';
	}

	private static function clear_wp_cache_define(): bool {
		if ( ! defined( 'WP_CACHE' ) || ! WP_CACHE ) {
			return true;
		}

		$wp_config = self::get_config_file_name();

		if ( ! is_writable( $wp_config ) ) {
			return false;
		}

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

		if ( defined( 'URLSLAB_ADVANCED_CACHE' ) ) {
			return true;
		}

		$advanced_cache_plugin_file = URLSLAB_PLUGIN_DIR . 'advanced-cache.php';
		if ( file_exists( WP_CONTENT_DIR . '/advanced-cache.php' ) ) {
			//check if urlslab advanced-cache.php is included
			$advanced_cache_content = file_get_contents( WP_CONTENT_DIR . '/advanced-cache.php' );
			if ( preg_match( '/require_once\\s*?\\(\\s*?\'' . preg_quote( $advanced_cache_plugin_file, '/' ) . '\'\\s*?\\)\\s*?;/m', $advanced_cache_content ) ) {
				//file exists and urlslab advanced-cache.php is included
				return true;
			} else {
				//include urlslab advanced-cache.php
				if ( empty( trim( $advanced_cache_content ) ) || false === strpos( $advanced_cache_content, '<?php' ) ) {
					$advanced_cache_content = '<?php';
				}
				$advanced_cache_content = preg_replace( '/(<\?php)/i', self::get_advanced_cache_file_content(), $advanced_cache_content );

				return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', $advanced_cache_content );
			}
		} else {
			//doesn't exist, create it and include advanced-cache.php from urlslab plugin
			return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', self::get_advanced_cache_file_content() );
		}
	}

	private static function get_advanced_cache_file_content() {
		$advanced_cache_plugin_file = URLSLAB_PLUGIN_DIR . 'advanced-cache.php';

		return "<?php\n//URLSLAB START\nif ( is_file( '" . $advanced_cache_plugin_file . "' ) ) {\n\trequire_once( '" . $advanced_cache_plugin_file . "' );\n}\n//URLSLAB END\n";
	}

	private static function clear_advanced_cache_file(): bool {
		if ( file_exists( WP_CONTENT_DIR . '/advanced-cache.php' ) ) {
			$advanced_cache_content = file_get_contents( WP_CONTENT_DIR . '/advanced-cache.php' );
			if ( preg_match( '/^(.*?)\\/\\/URLSLAB START.*?URLSLAB END(.*?)$/s', $advanced_cache_content, $matches ) ) {
				//urlslab advanced-cache.php is included, remove it
				$advanced_cache_content = trim( $matches[1] ) . "\n" . trim( $matches[2] );

				return false !== file_put_contents( WP_CONTENT_DIR . '/advanced-cache.php', $advanced_cache_content );
			}
		}

		return true;
	}
}
