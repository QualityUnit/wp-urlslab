<?php

class Urlslab_Cache extends Urlslab_Widget {
	public const SLUG = 'urlslab-cache';
	const SETTING_NAME_PAGE_CACHING = 'urlslab-cache-page';
	const SETTING_NAME_PAGE_CACHE_TTL = 'urlslab-cache-page-ttl';
	const PAGE_CACHE_GROUP = 'cache-page';
	private static bool $cache_started = false;

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Caching' );
	}

	public function get_widget_description(): string {
		return __( 'Increase speed of page loading with simple caching of content to disk.' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE, self::LABEL_EXPERT );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'wp_headers', $this, 'page_cache_headers', PHP_INT_MAX, 1 );
		Urlslab_Loader::get_instance()->add_action( 'template_redirect', $this, 'page_cache_start', PHP_INT_MAX, 0 );
		Urlslab_Loader::get_instance()->add_action( 'shutdown', $this, 'page_cache_save', 0, 0 );
	}

	private function is_cache_enabled(): bool {
		return ! is_user_logged_in() && $this->get_option( self::SETTING_NAME_PAGE_CACHING ) && Urlslab_File_Cache::get_instance()->is_active();
	}

	public function page_cache_headers( $headers ) {
		if ( ! $this->is_cache_enabled() ) {
			return $headers;
		}
		if ( Urlslab_File_Cache::get_instance()->exists( $_SERVER['REQUEST_URI'], self::PAGE_CACHE_GROUP ) ) {
			$headers['X-URLSLAB-CACHE-HIT'] = 'Y';
		}
		$headers['Cache-Control'] = 'public, max-age=' . $this->get_option( self::SETTING_NAME_PAGE_CACHE_TTL );
		$headers['Expires']       = gmdate( 'D, d M Y H:i:s', time() + $this->get_option( self::SETTING_NAME_PAGE_CACHE_TTL ) ) . ' GMT';
		$headers['Pragma']        = 'public';

		return $headers;
	}


	public function page_cache_start() {
		if ( ! $this->is_cache_enabled() ) {
			return;
		}
		if ( Urlslab_File_Cache::get_instance()->exists( $_SERVER['REQUEST_URI'], self::PAGE_CACHE_GROUP ) ) {
			$content = Urlslab_File_Cache::get_instance()->get( $_SERVER['REQUEST_URI'], self::PAGE_CACHE_GROUP, $found );
			if ( strlen( $content ) > 0 ) {
				echo $content; // phpcs:ignore
				exit;
			}
		}
		ob_start();
		self::$cache_started = true;

	}

	public function page_cache_save() {
		if ( ! self::$cache_started ) {
			return;
		}
		Urlslab_File_Cache::get_instance()->set( $_SERVER['REQUEST_URI'], ob_get_contents(), self::PAGE_CACHE_GROUP, $this->get_option( self::SETTING_NAME_PAGE_CACHE_TTL ) );
		ob_end_flush();
	}

	protected function add_options() {
		$this->add_options_form_section( 'page', __( 'Page Caching' ), __( 'Speedup loading of your wordpress page with caching whole content to disk and servering content certain time from disk cache. Cached are just pages generated for not logged in users!' ) );

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHING,
			false,
			true,
			__( 'Page content caching' ),
			__( 'Activate page caching to disk.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'page'
		);
		$this->add_option_definition(
			self::SETTING_NAME_PAGE_CACHE_TTL,
			900,
			false,
			__( 'Cache Validity (Time To Live in seconds)' ),
			__( 'Define how long (in seconds) is considered the cache on disk or in browser valid. After this time will be the page generated again by wordpress. Value should be higher as 0.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'page'
		);
	}

}
