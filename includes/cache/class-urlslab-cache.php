<?php

class Urlslab_Cache {

	/**
	 * @var Urlslab_Cache
	 */
	public static $instance;

	protected $memory_cache = array();

	private Urlslab_Cache_Driver $driver;


	public static function get_instance(): Urlslab_Cache {
		if ( null === self::$instance ) {
			self::$instance = new Urlslab_Cache();
			self::$instance->init();
		}

		return self::$instance;
	}

	private function init() {
		require_once URLSLAB_PLUGIN_DIR . '/includes/cache/driver/class-urlslab-cache-driver.php';
		require_once URLSLAB_PLUGIN_DIR . '/includes/cache/driver/class-urlslab-cache-driver-file.php';
		$this->driver = new Urlslab_Cache_Driver_File();
	}

	private function is_driver_active() {
		if ( wp_using_ext_object_cache() ) {
			return true;
		}

		if ( is_object( $this->driver ) ) {
			return $this->driver->is_active();
		}

		return false;
	}

	private function get_data_as_content( $data, int $expiration = 0 ) {
		return array(
			'data'       => $data,
			'expiration' => $expiration > 0 ? ( time() + (int) $expiration ) : 0,
			'created'    => time(),
		);
	}

	public function set( $key, $data, $group = '', $expiration = 3600 ): bool {
		if ( wp_using_ext_object_cache() ) {
			return wp_cache_set( $key, $data, $group, $expiration );
		}

		$this->memory_cache[ $group ][ $key ] = $this->get_data_as_content( $data, $expiration );

		if ( $this->is_driver_active() ) {
			return $this->driver->set( $key, $this->memory_cache[ $group ][ $key ], $group );
		}

		return true;
	}

	public function get( $key, $group = '', &$found = null, $allowed_classes = false, $valid_from = 0, $force = false ) {
		if ( wp_using_ext_object_cache() ) {
			return wp_cache_get( $key, $group, $force, $found );
		}

		if ( $force || ( ! isset( $this->memory_cache[ $group ][ $key ] ) && $this->is_driver_active() ) ) {
			$content = $this->driver->get( $key, $group, $found, $allowed_classes );
			if ( $found ) {
				$this->memory_cache[ $group ][ $key ] = $content;
			}
		}
		if ( isset( $this->memory_cache[ $group ][ $key ] ) ) {
			if ( $this->is_content_invalid( $this->memory_cache[ $group ][ $key ], $valid_from ) ) {
				$this->delete( $key, $group );
				$found = false;

				return false;
			}
			$found = true;

			return $this->memory_cache[ $group ][ $key ]['data'];
		}

		$found = false;

		return false;
	}

	public function delete( $key, $group = '' ): bool {
		if ( wp_using_ext_object_cache() ) {
			return wp_cache_delete( $key, $group );
		}

		unset( $this->memory_cache[ $group ][ $key ] );
		if ( $this->is_driver_active() ) {
			return $this->driver->delete( $key, $group );
		}

		return true;
	}

	public function delete_group( $group = '' ) {
		if ( wp_using_ext_object_cache() ) {
			return wp_cache_flush_group( $group );
		}

		unset( $this->memory_cache[ $group ] );
		if ( $this->is_driver_active() ) {
			return $this->driver->delete_group( $group );
		}

		return true;
	}

	private function is_content_invalid( $content, $valid_from ) {
		return ! is_array( $content ) ||
			   (
				   0 !== $content['expiration'] &&
				   time() > $content['expiration']
			   ) ||
			   (
				   $valid_from > 0 &&
				   (
					   ! isset( $content['created'] ) ||
					   $content['created'] < $valid_from
				   )
			   );
	}

}
