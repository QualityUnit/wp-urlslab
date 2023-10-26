<?php
require_once ABSPATH . 'wp-admin/includes/file.php';

class Urlslab_Tool_Geoip {
	private static $cache = array();
	private static string $path = '';

	private static function is_geoip_active(): bool {
		if ( strlen( self::$path ) ) {
			return true;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );
		if ( ! $widget->get_option( Urlslab_Widget_General::SETTING_NAME_GEOIP ) ) {
			return false;
		}

		$path = self::get_path();
		if ( ! file_exists( $path ) ) {
			if ( $widget->get_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DOWNLOAD ) && strlen( $widget->get_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_API_KEY ) ) && false !== @exec( 'cd ./' ) ) { //phpcs:ignore
				if ( ! file_exists( wp_upload_dir()['basedir'] . '/geoip.tar.gz' ) ) {
					$downloaded = download_url( 'https://download.maxmind.com/app/geoip_download?edition_id=GeoIP2-City-CSV&license_key=' . urlencode( $widget->get_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_API_KEY ) ) . '&suffix=tar.gz' );
					if ( false === $downloaded || is_wp_error( $downloaded ) ) {
						//don't try to download again
						$widget->update_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DOWNLOAD, false );

						return false;
					}
					if ( ! rename( $downloaded, wp_upload_dir()['basedir'] . '/geoip.tar.gz' ) ) {
						$widget->update_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DOWNLOAD, false );

						return false;
					}
				}

				$result = @exec( 'tar -zvxf ' . wp_upload_dir()['basedir'] . '/geoip.tar.gz -C ' . wp_upload_dir()['basedir'] . ' --wildcards "*.mmdb" --strip-components 1' ); //phpcs:ignore
				if ( false === $result || ! file_exists( wp_upload_dir()['basedir'] . '/GeoLite2-City.mmdb' ) ) {
					$widget->update_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DOWNLOAD, false );

					return false;
				}
			} else {
				$widget->update_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DOWNLOAD, false );

				return false;
			}
		}
		self::$path = $path;

		return true;
	}

	public static function get_country( $ip ) {
		if ( empty( $ip ) || '127.0.0.1' == $ip ) {
			return '';
		}

		if ( ! isset( self::$cache[ $ip ] ) ) {
			if ( ! self::is_geoip_active() ) {
				return '';
			}
			self::$cache[ $ip ] = self::get_record( $ip );
		}

		if ( self::$cache[ $ip ] ) {
			return strtolower( self::$cache[ $ip ]->country->isoCode );
		}

		return '';
	}

	private static function get_record( $ip ) {
		try {
			$reader = new GeoIp2\Database\Reader( self::get_path() );

			return $reader->city( $ip );
		} catch ( Exception $e ) {
		}

		return false;
	}

	private static function get_path(): string {
		if ( strlen( self::$path ) ) {
			return self::$path;
		}

		$path = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG )->get_option( Urlslab_Widget_General::SETTING_NAME_GEOIP_DB_PATH );
		if ( empty( $path ) ) {
			$path = wp_upload_dir()['basedir'] . '/GeoLite2-City.mmdb';
		}

		return $path;
	}

}
