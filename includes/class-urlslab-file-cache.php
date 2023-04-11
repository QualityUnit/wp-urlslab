<?php

class Urlslab_File_Cache {
	public static $instance;
	private $cache_path;

	private $mem_cache = array();

	public function __construct() {
		$this->cache_path = wp_upload_dir()['basedir'] . '/urlslab/';
		if ( ! file_exists( $this->cache_path ) ) {
			@mkdir( $this->cache_path, 0755, true ); // phpcs:ignore
		}
	}

	public static function get_instance(): Urlslab_File_Cache {
		if ( null === self::$instance ) {
			self::$instance = new Urlslab_File_Cache();
		}

		return self::$instance;
	}

	public function is_active() {
		return file_exists( $this->cache_path ) && is_writable( $this->cache_path );
	}

	public function set( $key, $data, $group = '', $expiration = 3600 ) {
		if ( ! $this->is_active() ) {
			return;
		}
		$file                              = $this->cache_path . md5( $key ) . '_' . $group . '.cache';
		$content                           = array(
			'data'       => $data,
			'expiration' => $expiration > 0 ? ( time() + (int) $expiration ) : 0,
		);
		$this->mem_cache[ $group ][ $key ] = $content;
		@file_put_contents( $file, serialize( $content ) );
	}

	/**
	 * @param            $allowed_classes array or boolean - if array, it should contain names of classes
	 * @param mixed $key
	 * @param mixed $group
	 * @param null|mixed $found
	 *
	 * @return false|mixed
	 */
	public function get( $key, $group = '', &$found = null, $allowed_classes = false ) {
		if ( ! $this->is_active() ) {
			$found = false;

			return false;
		}

		if ( isset( $this->mem_cache[ $group ][ $key ] ) ) {
			$content = $this->mem_cache[ $group ][ $key ];
		} else {
			$file = $this->cache_path . md5( $key ) . '_' . $group . '.cache';
			if ( ! file_exists( $file ) ) {
				$found = false;

				return false;
			}
			$content = unserialize( file_get_contents( $file ), array( 'allowed_classes' => $allowed_classes ) );
		}

		if ( 0 !== $content['expiration'] && time() > $content['expiration'] ) {
			@unlink( $file );
			$found = false;

			return false;
		}

		$found = true;

		return $content['data'];
	}

	public function delete( $key, $group = '' ) {
		unset( $this->mem_cache[ $group ][ $key ] );
		if ( ! $this->is_active() ) {
			return;
		}
		$file = $this->cache_path . md5( $key ) . '_' . $group . '.cache';
		if ( file_exists( $file ) ) {
			@unlink( $file );
		}
	}

	public function clear( $group = '' ) {
		$this->mem_cache[ $group ] = array();
		if ( ! $this->is_active() ) {
			return;
		}
		$files = glob( $this->cache_path . '*_' . $group . '.cache' );
		if ( false === $files ) {
			return;
		}
		foreach ( $files as $file ) {
			@unlink( $file );
		}
	}
}
