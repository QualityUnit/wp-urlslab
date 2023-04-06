<?php


class Urlslab_File_Cache {

	private $cache_path;

	static $instance = null;

	private $mem_cache = array();

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new Urlslab_File_Cache();
		}

		return self::$instance;
	}

	public function __construct() {
		$this->cache_path = wp_upload_dir()['basedir'] . '/urlslab/';
		if ( ! file_exists( $this->cache_path ) ) {
			@mkdir( $this->cache_path, 0755, true );// phpcs:ignore
		}
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

	public function get( $key, $group = '', &$found = null ) {
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
			$content = unserialize( file_get_contents( $file ) );
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
		foreach ( $files as $file ) {
			@unlink( $file );
		}
	}
}
