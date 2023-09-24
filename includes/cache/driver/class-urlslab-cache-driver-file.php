<?php

class Urlslab_Cache_Driver_File extends Urlslab_Cache_Driver {
	private $cache_path;

	public function __construct() {
		$this->cache_path = wp_upload_dir()['basedir'] . '/urlslab/';
		if ( ! file_exists( $this->cache_path ) ) {
			@mkdir( $this->cache_path, 0755, true ); // phpcs:ignore
		}
	}

	public function is_active() {
		return file_exists( $this->cache_path ) && is_writable( $this->cache_path );
	}

	private function get_file_name( $key, $group = '' ): string {
		return $this->cache_path . md5( $key ) . '_' . $group . '.cache';
	}

	public function set( $key, $content, $group = '' ): bool {
		if ( ! $this->is_active() ) {
			return false;
		}
		$written = @file_put_contents( $this->get_file_name($key, $group), serialize( $content ) );

		return false !== $written;
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
		$file  = $this->get_file_name( $key, $group );
		$found = false;
		if ( ! file_exists( $file ) ) {
			return false;
		}

		$file_content = file_get_contents( $file );
		if ( false === $file_content ) {
			return false;
		}
		$found = true;

		return unserialize( $file_content, array( 'allowed_classes' => $allowed_classes ) );
	}

	public function delete( $key, $group = '' ): bool {
		if ( ! $this->is_active() ) {
			return false;
		}
		$file = $this->get_file_name( $key, $group );
		if ( file_exists( $file ) ) {
			@unlink( $file );
		}

		return true;
	}

	public function delete_group( $group = '' ): bool {
		if ( ! $this->is_active() ) {
			return false;
		}
		$files = glob( $this->cache_path . '*_' . $group . '.cache' );
		if ( false !== $files ) {
			foreach ( $files as $file ) {
				@unlink( $file );
			}
		}

		return true;
	}

}
