<?php

class Urlslab_Tool_Htaccess {

	const MARKER = 'URLSLAB';

	public static function get_status() {
		$htaccess = new self();
		$status   = '<br/><br/>';
		if ( ! is_file( $htaccess->get_htaccess_file_name() ) ) {
			$status .= sprintf( __( 'File `%s` does not exist' ), $htaccess->get_htaccess_file_name() );
		} else if ( ! $htaccess->is_writable() ) {
			$status .= sprintf( __( 'File `%s` is not writable, please make it writable.' ), $htaccess->get_htaccess_file_name() );
		} else {
			if ( $htaccess->has_marker() ) {
				$status .= sprintf( __( 'File `%s` is configured.' ), $htaccess->get_htaccess_file_name() );
			} else {
				$status .= sprintf( __( 'File `%s` is writable, but not yet configured with urlslab settings.' ), $htaccess->get_htaccess_file_name() );
			}
		}

		return $status;
	}

	public function is_writable() {
		if ( ! function_exists( 'insert_with_markers' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/misc.php' );
		}

		$filename = $this->get_htaccess_file_name();

		return function_exists( 'insert_with_markers' ) && is_file( $filename ) && is_writable( $filename );
	}

	public function get_htaccess_file_name() {
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . '/wp-admin/includes/file.php';
			WP_Filesystem();
		}
		/** @var WP_Filesystem_Base $wp_filesystem */
		global $wp_filesystem;

		if ( file_exists( $wp_filesystem->abspath() . 'wp-config.php' ) ) {
			return $wp_filesystem->abspath() . '.htaccess';
		} else if ( file_exists( dirname( $wp_filesystem->abspath() ) . '/wp-config.php' ) ) {
			return dirname( $wp_filesystem->abspath() ) . '/.htaccess';
		}

		return ABSPATH . '.htaccess';
	}

	public function cleanup(): bool {
		if ( ! $this->is_writable() ) {
			return false;
		}

		$file_name = $this->get_htaccess_file_name();
		$content   = file_get_contents( $file_name );
		$content   = trim( preg_replace( '/# BEGIN ' . self::MARKER . '.*# END ' . self::MARKER . '/s', '', $content ) );

		return file_put_contents( $file_name, $content );
	}

	public function update(): bool {
		if ( ! $this->is_writable() ) {
			return false;
		}
		$this->cleanup();
		$file_name = $this->get_htaccess_file_name();

		file_put_contents( $file_name, "\n# BEGIN " . self::MARKER . "\n\n# END URLSLAB\n\n" . file_get_contents( $file_name ) );

		return insert_with_markers( $file_name, self::MARKER, $this->get_htaccess_array() ) && Urlslab_Tool_Config::init_advanced_cache();
	}

	private function get_htaccess_redirect_rules(): array {
		$rules     = array();
		$has_rules = false;
		/** @var Urlslab_Widget_Redirects $widget_redirects */
		$widget_redirects = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG );

		//redirects
		if ( $widget_redirects ) {
			$rules[] = '';

			$rules[] = '<IfModule mod_rewrite.c>';
			$rules[] = '	RewriteEngine On';

			//http to https
			if ( $widget_redirects->get_option( Urlslab_Widget_Redirects::SETTING_NAME_REDIRECT_TO_HTTPS ) ) {
				$rules[]   = '';
				$rules[]   = '	RewriteCond %{REQUEST_METHOD} =GET';
				$rules[]   = '	RewriteCond %{REQUEST_SCHEME} =http';
				$rules[]   = '	RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]';
				$has_rules = true;
			}

			//non www to www
			if ( Urlslab_Widget_Redirects::NONWWW_TO_WWW === $widget_redirects->get_option( Urlslab_Widget_Redirects::SETTING_NAME_REDIRECT_WWW ) ) {
				$rules[]   = '';
				$rules[]   = '	RewriteCond %{REQUEST_METHOD} =GET';
				$rules[]   = '	RewriteCond %{HTTP_HOST} !^www\\..+$ [NC]';
				$rules[]   = '	RewriteRule ^ %{REQUEST_SCHEME}://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]';
				$has_rules = true;
			} else if ( Urlslab_Widget_Redirects::WWW_TO_NONWWW === $widget_redirects->get_option( Urlslab_Widget_Redirects::SETTING_NAME_REDIRECT_WWW ) ) {
				$rules[]   = '';
				$rules[]   = '	RewriteCond %{REQUEST_METHOD} =GET';
				$rules[]   = '	RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]';
				$rules[]   = '	RewriteRule ^ %{REQUEST_SCHEME}://%1%{REQUEST_URI} [L,R=301]';
				$has_rules = true;
			}

			global $wpdb;
			$results   = $wpdb->get_results( 'SELECT * FROM ' . URLSLAB_REDIRECTS_TABLE, 'ARRAY_A' ); // phpcs:ignore
			$redirects = array();
			if ( ! empty( $results ) ) {
				$rules[] = '';
				foreach ( $results as $result ) {
					$redirects[] = new Urlslab_Data_Redirect( $result );
				}

				foreach ( $redirects as $redirect ) {
					/** @var Urlslab_Data_Redirect $redirect */

					if (
						! strlen( $redirect->get_match_url() ) ||
						! strlen( $redirect->get_replace_url() ) ||
						strlen( $redirect->get_capabilities() ) ||
						strlen( $redirect->get_roles() ) ||
						strlen( $redirect->get_headers() ) ||
						strlen( $redirect->get_ip() ) ||
						strlen( $redirect->get_params() ) ||
						strlen( $redirect->get_cookie() ) ||
						Urlslab_Data_Redirect::NOT_FOUND_STATUS_ANY !== $redirect->get_if_not_found() ||
						! is_numeric( $redirect->get_redirect_code() )
					) {
						continue;
					}


					if ( Urlslab_Data_Redirect::LOGIN_STATUS_LOGIN_REQUIRED === $redirect->get_is_logged() ) {
						$rules[]   = '	RewriteCond %{HTTP_COOKIE} ^.*wordpress_logged_in_.*$ [NC]';
						$has_rules = true;
					} else if ( Urlslab_Data_Redirect::LOGIN_STATUS_NOT_LOGGED_IN === $redirect->get_is_logged() ) {
						$rules[]   = '	RewriteCond %{HTTP_COOKIE} !^.*wordpress_logged_in_.*$ [NC]';
						$has_rules = true;
					}

					if ( strlen( $redirect->get_browser() ) ) {
						$rules[]   = '	RewriteCond %{HTTP_USER_AGENT} ^.*' . preg_quote( $redirect->get_browser() ) . '.*$ [NC]';
						$has_rules = true;
					}

					$appendix = ' [L,R=' . ( (int) $redirect->get_redirect_code() ) . ']';
					switch ( $redirect->get_match_type() ) {
						case Urlslab_Data_Redirect::MATCH_TYPE_SUBSTRING:
							$rules[]   = '	RewriteRule ^.*?' . preg_quote( $redirect->get_match_url() ) . '.*?$ ' . $redirect->get_replace_url() . $appendix;
							$has_rules = true;
							break;
						case Urlslab_Data_Redirect::MATCH_TYPE_EXACT:
							$rules[]   = '	RewriteRule ^' . preg_quote( $redirect->get_match_url() ) . '$ ' . $redirect->get_replace_url() . $appendix;
							$has_rules = true;
							break;
						case Urlslab_Data_Redirect::MATCH_TYPE_REGEXP:
							$rules[]   = '	RewriteRule ' . $redirect->get_match_url() . ' ' . $redirect->get_replace_url() . $appendix;
							$has_rules = true;
							break;
						default:
							break;
					}
				}
			}
			$rules[] = '</IfModule>';
		}
		if ( $has_rules ) {
			return $rules;
		}

		return array();
	}


	private function get_htaccess_security_rules(): array {
		$rules = array();
		/** @var Urlslab_Widget_Security $widget_security */
		$widget_security = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Security::SLUG );

		if ( $widget_security ) {
			//Headers
			$rules[] = '';
			$rules[] = '<IfModule mod_headers.c>';
			$rules[] = '	Header unset X-Frame-Options';
			$rules[] = '	Header always unset X-Frame-Options';

			if ( ! empty( $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_REFERRER_POLICY ) ) && 'none' != $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_REFERRER_POLICY ) ) {
				$rules[] = '	Header set Referrer-Policy "' . $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_REFERRER_POLICY ) . '"';
			}
			if ( ! empty( $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_X_FRAME_OPTIONS ) ) && 'none' != $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_X_FRAME_OPTIONS ) ) {
				$rules[] = '	Header set X-Frame-Options "' . $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_X_FRAME_OPTIONS ) . '"';
			}
			if ( ! empty( $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_PERMISSIONS_POLICY ) ) ) {
				$rules[] = '	Header set Permissions-Policy "' . $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_PERMISSIONS_POLICY ) . '"';
			}
			if ( ! empty( $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_STRICT_TRANSPORT_SECURITY ) ) ) {
				$rules[] = '	Header set Strict-Transport-Security "' . $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_STRICT_TRANSPORT_SECURITY ) . '"';
			}
			if ( $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_X_CONTENT_TYPE_OPTIONS ) ) {
				$rules[] = '	Header set X-Content-Type-Options nosniff';
			}

			$csp = $widget_security->get_csp( true );
			if ( ! empty( $csp ) && 4000 > strlen( $csp ) ) {
				if ( 'report' !== $widget_security->get_option( Urlslab_Widget_Security::SETTING_NAME_SET_CSP ) ) {
					$rules[] = '	Header set Content-Security-Policy "' . $csp . '"';
				} else {
					$rules[] = '	Header set Content-Security-Policy-Report-Only "' . $csp . '"';
				}
			}
			$rules[] = '</IfModule>';
		}

		return $rules;
	}

	private function get_htaccess_cache_rules(): array {
		$rules = array();

		/** @var Urlslab_Widget_Cache $widget_cache */
		$widget_cache = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );


		if ( $widget_cache ) {
			$expire_time = $widget_cache->get_option( Urlslab_Widget_Cache::SETTING_NAME_DEFAULT_CACHE_TTL );
			$rules[]     = '';

			//charset
			$rules[] = 'AddDefaultCharset UTF-8';
			$rules[] = 'FileETag None';
			$rules[] = '';
			$rules[] = '<IfModule mod_mime.c>';
			$rules[] = '	AddCharset UTF-8 .html .js .css .json .rss .vtt .xml .atom .svg .txt .csv .woff .woff2';
			$rules[] = '</IfModule>';

			//file types
			$rules[] = '';
			$rules[] = '<IfModule mod_mime.c>';
			$rules[] = '	AddType text/css .css';
			$rules[] = '	AddType text/x-component .htc';
			$rules[] = '	AddType application/x-javascript .js';
			$rules[] = '	AddType application/javascript .js2';
			$rules[] = '	AddType text/javascript .js3';
			$rules[] = '	AddType text/x-js .js4';
			$rules[] = '	AddType video/asf .asf .asx .wax .wmv .wmx';
			$rules[] = '	AddType video/avi .avi';
			$rules[] = '	AddType image/avif .avif';
			$rules[] = '	AddType image/avif-sequence .avifs';
			$rules[] = '	AddType image/bmp .bmp';
			$rules[] = '	AddType application/java .class';
			$rules[] = '	AddType video/divx .divx';
			$rules[] = '	AddType application/msword .doc .docx';
			$rules[] = '	AddType application/vnd.ms-fontobject .eot';
			$rules[] = '	AddType application/x-msdownload .exe';
			$rules[] = '	AddType image/gif .gif';
			$rules[] = '	AddType application/x-gzip .gz .gzip';
			$rules[] = '	AddType image/x-icon .ico';
			$rules[] = '	AddType image/jpeg .jpg .jpeg .jpe';
			$rules[] = '	AddType image/webp .webp';
			$rules[] = '	AddType application/json .json';
			$rules[] = '	AddType application/vnd.ms-access .mdb';
			$rules[] = '	AddType audio/midi .mid .midi';
			$rules[] = '	AddType video/quicktime .mov .qt';
			$rules[] = '	AddType audio/mpeg .mp3 .m4a';
			$rules[] = '	AddType video/mp4 .mp4 .m4v';
			$rules[] = '	AddType video/mpeg .mpeg .mpg .mpe';
			$rules[] = '	AddType video/webm .webm';
			$rules[] = '	AddType application/vnd .ms-project .mpp';
			$rules[] = '	AddType application/x-font-otf .otf';
			$rules[] = '	AddType application/vnd .ms-opentype ._otf';
			$rules[] = '	AddType application/vnd .oasis .opendocument .database .odb';
			$rules[] = '	AddType application/vnd .oasis .opendocument .chart .odc';
			$rules[] = '	AddType application/vnd .oasis .opendocument .formula .odf';
			$rules[] = '	AddType application/vnd .oasis .opendocument .graphics .odg';
			$rules[] = '	AddType application/vnd .oasis .opendocument .presentation .odp';
			$rules[] = '	AddType application/vnd .oasis .opendocument .spreadsheet .ods';
			$rules[] = '	AddType application/vnd .oasis .opendocument .text .odt';
			$rules[] = '	AddType audio/ogg .ogg';
			$rules[] = '	AddType video/ogg .ogv';
			$rules[] = '	AddType application/pdf .pdf';
			$rules[] = '	AddType image/png .png';
			$rules[] = '	AddType application/vnd .ms-powerpoint .pot .pps .ppt .pptx';
			$rules[] = '	AddType audio/x-realaudio .ra .ram';
			$rules[] = '	AddType image/svg+xml .svg .svgz';
			$rules[] = '	AddType application/x-shockwave-flash .swf';
			$rules[] = '	AddType application/x-tar .tar';
			$rules[] = '	AddType image/tiff .tif .tiff';
			$rules[] = '	AddType application/x-font-ttf .ttf .ttc';
			$rules[] = '	AddType application/vnd .ms-opentype ._ttf';
			$rules[] = '	AddType audio/wav .wav';
			$rules[] = '	AddType audio/wma .wma';
			$rules[] = '	AddType application/vnd .ms - write .wri';
			$rules[] = '	AddType application/font - woff .woff';
			$rules[] = '	AddType application/font - woff2 .woff2';
			$rules[] = '	AddType application/vnd .ms - excel .xla .xls .xlsx .xlt .xlw';
			$rules[] = '	AddType application/zip .zip';
			$rules[] = '	AddType text/html .html .htm';
			$rules[] = '</IfModule>';
			$rules[] = '';

			if ( is_numeric( $expire_time ) && $expire_time > 0 ) {
				$rules[] = '<IfModule mod_expires.c>';
				$rules[] = '	ExpiresActive On';
				$rules[] = '	ExpiresByType text/css A' . $expire_time;
				$rules[] = '	ExpiresByType text/x-component A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-javascript A' . $expire_time;
				$rules[] = '	ExpiresByType application/javascript A' . $expire_time;
				$rules[] = '	ExpiresByType text/javascript A' . $expire_time;
				$rules[] = '	ExpiresByType text/x-js A' . $expire_time;
				$rules[] = '	ExpiresByType text/html A' . $expire_time;
				$rules[] = '	ExpiresByType text/richtext A' . $expire_time;
				$rules[] = '	ExpiresByType image/svg+xml A' . $expire_time;
				$rules[] = '	ExpiresByType text/plain A' . $expire_time;
				$rules[] = '	ExpiresByType text/xsd A' . $expire_time;
				$rules[] = '	ExpiresByType text/xsl A' . $expire_time;
				$rules[] = '	ExpiresByType text/xml A' . $expire_time;
				$rules[] = '	ExpiresByType video/asf A' . $expire_time;
				$rules[] = '	ExpiresByType video/avi A' . $expire_time;
				$rules[] = '	ExpiresByType image/bmp A' . $expire_time;
				$rules[] = '	ExpiresByType application/java A' . $expire_time;
				$rules[] = '	ExpiresByType video/divx A' . $expire_time;
				$rules[] = '	ExpiresByType application/msword A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-fontobject A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-msdownload A' . $expire_time;
				$rules[] = '	ExpiresByType image/gif A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-gzip A' . $expire_time;
				$rules[] = '	ExpiresByType image/x-icon A' . $expire_time;
				$rules[] = '	ExpiresByType image/jpeg A' . $expire_time;
				$rules[] = '	ExpiresByType application/json A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-access A' . $expire_time;
				$rules[] = '	ExpiresByType audio/midi A' . $expire_time;
				$rules[] = '	ExpiresByType video/quicktime A' . $expire_time;
				$rules[] = '	ExpiresByType audio/mpeg A' . $expire_time;
				$rules[] = '	ExpiresByType video/mp4 A' . $expire_time;
				$rules[] = '	ExpiresByType video/mpeg A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-project A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-font-otf A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-opentype A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.database A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.chart A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.formula A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.graphics A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.presentation A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.spreadsheet A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.oasis.opendocument.text A' . $expire_time;
				$rules[] = '	ExpiresByType audio/ogg A' . $expire_time;
				$rules[] = '	ExpiresByType application/pdf A' . $expire_time;
				$rules[] = '	ExpiresByType image/png A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-powerpoint A' . $expire_time;
				$rules[] = '	ExpiresByType audio/x-realaudio A' . $expire_time;
				$rules[] = '	ExpiresByType image/svg+xml A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-shockwave-flash A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-tar A' . $expire_time;
				$rules[] = '	ExpiresByType image/tiff A' . $expire_time;
				$rules[] = '	ExpiresByType application/x-font-ttf A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-opentype A' . $expire_time;
				$rules[] = '	ExpiresByType audio/wav A' . $expire_time;
				$rules[] = '	ExpiresByType audio/wma A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-write A' . $expire_time;
				$rules[] = '	ExpiresByType application/font-woff A' . $expire_time;
				$rules[] = '	ExpiresByType application/font-woff2 A' . $expire_time;
				$rules[] = '	ExpiresByType application/vnd.ms-excel A' . $expire_time;
				$rules[] = '	ExpiresByType application/zip A' . $expire_time;
				$rules[] = '</IfModule>';
			}

			//Headers
			$rules[] = '';
			$rules[] = '<IfModule mod_headers.c>';
			$rules[] = '	Header unset ETag';
			$rules[] = '	Header append Cache-Control ""';
			$rules[] = '';


			$cache_rules = $widget_cache->get_cache_rules();
			foreach ( $cache_rules as $cache_rule ) {
				/** @var Urlslab_Data_Cache_Rule $cache_rule */

				if (
					Urlslab_Data_Cache_Rule::ACTIVE_YES !== $cache_rule->get_is_active() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_paged() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_page() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_archive() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_feed() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_attachment() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_author() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_category() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_front_page() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_home() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_search() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_sticky() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_single() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_singular() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_tag() ||
					Urlslab_Data_Cache_Rule::YES === $cache_rule->get_is_tax()
				) {
					continue;
				}

				switch ( $cache_rule->get_match_type() ) {
					case Urlslab_Data_Cache_Rule::MATCH_TYPE_ALL_PAGES:
						$rules[] = '	Header edit Cache-Control "^$" "max-age=' . ( (int) $cache_rule->get_cache_ttl() ) . ', public"';
						break;
					case Urlslab_Data_Cache_Rule::MATCH_TYPE_EXACT:
						$rules[] = '	<FilesMatch "^' . preg_quote( $cache_rule->get_match_url() ) . '$">';
						$rules[] = '		Header edit Cache-Control "^$" "max-age=' . ( (int) $cache_rule->get_cache_ttl() ) . ', public"';
						$rules[] = '	</FilesMatch>';
						break;
					case Urlslab_Data_Cache_Rule::MATCH_TYPE_REGEXP:
						$rules[] = '	<FilesMatch "' . $cache_rule->get_match_url() . '">';
						$rules[] = '		Header edit Cache-Control "^$" "max-age=' . ( (int) $cache_rule->get_cache_ttl() ) . ', public"';
						$rules[] = '	</FilesMatch>';
						break;
					case Urlslab_Data_Cache_Rule::MATCH_TYPE_SUBSTRING:
						$rules[] = '	<FilesMatch ".*?' . preg_quote( $cache_rule->get_match_url() ) . '.*?">';
						$rules[] = '		Header edit Cache-Control "^$" "max-age=' . ( (int) $cache_rule->get_cache_ttl() ) . ', public"';
						$rules[] = '	</FilesMatch>';
						break;
					default:
						break;
				}
			}


			$rules[] = '';
			$rules[] = '	<FilesMatch "\.(jpe?g|png|gif)$">';
			$rules[] = '		Header append Vary Accept';
			$rules[] = '	</FilesMatch>';
			$rules[] = '';
			$rules[] = '	<FilesMatch ".(js|css|xml|gz|html)$">';
			$rules[] = '		Header append Vary: Accept-Encoding';
			$rules[] = '	</FilesMatch>';
			$rules[] = '';
			$rules[] = '	<FilesMatch "\.(css|htc|html|htm|less|js|js2|js3|js4|CSS|HTC|LESS|JS|JS2|JS3|JS4|asf|asx|wax|wmv|wmx|avi|bmp|class|divx|doc|docx|eot|exe|gif|gz|gzip|ico|jpg|jpeg|jpe|webp|json|mdb|mid|midi|mov|qt|mp3|m4a|mp4|m4v|mpeg|mpg|mpe|webm|mpp|otf|_otf|odb|odc|odf|odg|odp|ods|odt|ogg|pdf|png|pot|pps|ppt|pptx|ra|ram|svg|svgz|swf|tar|tif|tiff|ttf|ttc|_ttf|wav|wma|wri|woff|woff2|xla|xls|xlsx|xlt|xlw|zip|ASF|ASX|WAX|WMV|WMX|AVI|BMP|CLASS|DIVX|DOC|DOCX|EOT|EXE|GIF|GZ|GZIP|ICO|JPG|JPEG|JPE|WEBP|JSON|MDB|MID|MIDI|MOV|QT|MP3|M4A|MP4|M4V|MPEG|MPG|MPE|WEBM|MPP|OTF|_OTF|ODB|ODC|ODF|ODG|ODP|ODS|ODT|OGG|PDF|PNG|POT|PPS|PPT|PPTX|RA|RAM|SVG|SVGZ|SWF|TAR|TIF|TIFF|TTF|TTC|_TTF|WAV|WMA|WRI|WOFF|WOFF2|XLA|XLS|XLSX|XLT|XLW|ZIP)$">';
			$rules[] = '		Header unset Set-Cookie';
			$rules[] = '		Header unset Last-Modified';
			$rules[] = '		Header unset Pragma';

			if ( is_numeric( $expire_time ) ) {
				$rules[] = '		Header edit Cache-Control "^$" "max-age=' . ( (int) $expire_time ) . ', public"'; // default expire time
			}
			$rules[] = '	</FilesMatch>';
			$rules[] = '';
			$rules[] = '	<FilesMatch "\.(eot|otf|tt[cf]|woff2?)$">';
			$rules[] = '		Header set Access-Control-Allow-Origin "*"';
			$rules[] = '	</FilesMatch>';
			$rules[] = '';
			$rules[] = '	<IfModule mod_setenvif.c>';
			$rules[] = '		<FilesMatch "\.(json)$">';
			$rules[] = '			SetEnvIf Origin ":" IS_CORS';
			$rules[] = '			Header set Access-Control-Allow-Origin "*" env=IS_CORS';
			$rules[] = '		</FilesMatch>';
			$rules[] = '	</IfModule>';
			$rules[] = '';
			$rules[] = '</IfModule>';


			//deflate
			$rules[] = '';
			$rules[] = '<IfModule mod_deflate.c>';
			$rules[] = '	AddOutputFilterByType DEFLATE text/css text/x-component application/x-javascript application/javascript text/javascript text/x-js text/html text/richtext image/svg+xml text/plain text/xsd text/xsl text/xml image/bmp application/java application/msword application/vnd.ms-fontobject application/x-msdownload image/x-icon image/webp application/json application/vnd.ms-access video/webm application/vnd.ms-project application/x-font-otf application/vnd.ms-opentype application/vnd.oasis.opendocument.database application/vnd.oasis.opendocument.chart application/vnd.oasis.opendocument.formula application/vnd.oasis.opendocument.graphics application/vnd.oasis.opendocument.presentation application/vnd.oasis.opendocument.spreadsheet application/vnd.oasis.opendocument.text audio/ogg application/pdf application/vnd.ms-powerpoint image/svg+xml application/x-shockwave-flash image/tiff application/x-font-ttf application/vnd.ms-opentype audio/wav application/vnd.ms-write application/font-woff application/font-woff2 application/vnd.ms-excel';
			$rules[] = '	<IfModule mod_mime.c>';
			$rules[] = '		AddOutputFilter DEFLATE js css htm txt csv html xml';
			$rules[] = '	</IfModule>';
			$rules[] = '</IfModule>';

			//redirects
			$rules[] = '';
			$rules[] = '<IfModule mod_rewrite.c>';
			$rules[] = '	RewriteEngine On';


			$rules[] = '	RewriteBase /';
			$rules[] = '';

			$rules[] = '	RewriteRule ^ - [E=URLSLAB_HA_VER:' . URLSLAB_VERSION . ']';
			$rules[] = '	RewriteRule ^ - [E=UL_DIR:' . wp_get_upload_dir()['basedir'] . '/urlslab/]';
			$rules[] = '	RewriteRule ^ - [E=UL_UPL:' . wp_get_upload_dir()['basedir'] . '/urlslab/page/' . $widget_cache->get_option( Urlslab_Widget_Cache::SETTING_NAME_CACHE_VALID_FROM ) . '/]';
			$rules[] = '	RewriteRule ^ - [E=UL_CV:' . $widget_cache->get_option( Urlslab_Widget_Cache::SETTING_NAME_CACHE_VALID_FROM ) . ']';

			//copy to env variable
			$rules[] = '	RewriteRule ^ - [E=UL_QS:%{QUERY_STRING}]';
			if ( strlen( Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_IGNORE_PARAMETERS ) ) ) {
				$params = preg_split( '/\r\n|\r|\n|,/', Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_IGNORE_PARAMETERS ), - 1, PREG_SPLIT_NO_EMPTY );
				//remove blacklisted parameters from env variable
				foreach ( $params as $param ) {
					$param = trim( $param );
					if ( strlen( $param ) > 0 ) {
						$rules[] = '	RewriteCond %{ENV:UL_QS} ^(.*?&|)' . str_replace( '-', '\\-', $param ) . '(=[^&]*)?(&.*|)$ [NC]';
						$rules[] = '	RewriteRule ^ - [E=UL_QS:%1%3]';
					}
				}
				//remove trailing ampersand
				$rules[] = '	RewriteCond %{ENV:UL_QS} ^(&+|)(.*?)(&+|)$';
				$rules[] = '	RewriteRule ^ - [E=UL_QS:%2]';
			}


			$rules[] = '';
			$rules[] = '	RewriteCond %{ENV:UL_QS} ^(&+|)(.*?)(&+|)$';
			$rules[] = '	RewriteRule ^ - [E=UL_QS:%2]';

			$rules[] = '	RewriteCond %{HTTPS} =on';
			$rules[] = '	RewriteRule .* - [E=UL_SSL:_s]';

			$rules[] = '	RewriteCond %{SERVER_PORT} =443';
			$rules[] = '	RewriteRule .* - [E=UL_SSL:_s]';

			$rules[] = '	RewriteCond %{HTTP:X-Forwarded-Proto} =https [NC]';
			$rules[] = '	RewriteRule .* - [E=UL_SSL:_s]';
			$rules[] = '	RewriteRule ^ - [E=UL_FINAL:%{ENV:UL_UPL}%{HTTP_HOST}/%{REQUEST_URI}/p%{ENV:UL_SSL}.html]';
			//remove duplicate .. from path
			$rules[] = '	RewriteCond %{ENV:UL_FINAL} ^(.*?)\.\.(.*?)$';
			$rules[] = '	RewriteRule ^ - [E=UL_FINAL:%1/%2]';
			//remove duplicate // from path
			$rules[] = '	RewriteCond %{ENV:UL_FINAL} ^(.*?)\/\/\/(.*?)$';
			$rules[] = '	RewriteRule ^ - [E=UL_FINAL:%1/%2]';
			$rules[] = '	RewriteCond %{ENV:UL_FINAL} ^(.*?)\/\/(.*?)$';
			$rules[] = '	RewriteRule ^ - [E=UL_FINAL:%1/%2]';


			$rules[] = '	RewriteCond %{REQUEST_METHOD} !=POST';
			$rules[] = '	RewriteCond %{ENV:UL_QS} =""';
			$rules[] = '	RewriteCond %{HTTP_COOKIE} !(comment_author|wp\-postpass|logged|wptouch_switch_toggle) [NC]';

			$rules[] = '	RewriteCond "%{ENV:UL_FINAL}" -f';
			if ( is_numeric( $expire_time ) ) {
				$rules[] = '<IfModule mod_headers.c>';
				$rules[] = '		Header edit Cache-Control "^$" "max-age=' . ( (int) $expire_time ) . ', public"'; // default expire time
				$rules[] = '		Header set X-URLSLAB-Cache "hit-file"';
				$rules[] = '</IfModule>';
			}
			$rules[] = '	RewriteRule .* "%{ENV:UL_FINAL}" [L]';
			$rules[] = '';
			$rules[] = '</IfModule>';
		}

		return $rules;
	}

	private function get_htaccess_array(): array {
		$rules = array();

		$rules = array_merge( $rules, $this->get_htaccess_redirect_rules() );
		$rules = array_merge( $rules, $this->get_htaccess_security_rules() );

		return array_merge( $rules, $this->get_htaccess_cache_rules() );
	}

	private function has_marker(): bool {
		$filename = $this->get_htaccess_file_name();
		$content  = file_get_contents( $filename );

		return preg_match( '/# BEGIN ' . self::MARKER . '.*# END ' . self::MARKER . '/s', $content );
	}
}
