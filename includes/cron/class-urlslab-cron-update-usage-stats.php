<?php

class Urlslab_Cron_Update_Usage_Stats extends Urlslab_Cron {
	const FILE_USAGE = 'urlslab_file_usage_lck';
	const SCREENSHOT_USAGE = 'urlslab_screenshot_usage_lck';
	const URL_USAGE = 'urlslab_url_usage_lck';
	const LINKS_COUNT = 'urlslab_links_count_lck';

	public function get_description(): string {
		return __( 'Updating usage stats', 'wp-urlslab' );
	}

	protected function execute(): bool {
		if ( $this->update_file_usage() ) {
			return true;
		}

		if ( $this->update_url_usage() ) {
			return true;
		}

		$this->lock( 3600, Urlslab_Cron::LOCK );

		return false;
	}

	public function reset_locks( $max_time = 0 ): bool {
		if (
			! $this->is_stat_locked( self::FILE_USAGE, $max_time ) ||
			! $this->is_stat_locked( self::SCREENSHOT_USAGE, $max_time ) ||
			! $this->is_stat_locked( self::URL_USAGE, $max_time ) ||
			! $this->is_stat_locked( self::LINKS_COUNT, $max_time )
		) {
			$this->unlock( true );

			return true;
		}

		return false;
	}

	public function update_file_usage(): bool {
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ) {
			if ( ! $this->is_stat_locked( self::FILE_USAGE ) ) {
				$this->init_stat_lock( self::FILE_USAGE );
				Urlslab_Data_File::update_usage_count();

				return true;
			}
		}

		return false;
	}

	public function update_url_usage(): bool {
		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Media_Offloader::SLUG ) ) {
			if ( ! $this->is_stat_locked( self::SCREENSHOT_USAGE ) ) {
				$this->init_stat_lock( self::SCREENSHOT_USAGE );
				Urlslab_Data_Url::update_screenshot_usage_count();

				return true;
			}
		}

		if ( ! $this->is_stat_locked( self::URL_USAGE ) ) {
			$this->init_stat_lock( self::URL_USAGE );
			Urlslab_Data_Url::update_url_usage_count();

			return true;
		}

		if ( ! $this->is_stat_locked( self::LINKS_COUNT ) ) {
			$this->init_stat_lock( self::LINKS_COUNT );
			Urlslab_Data_Url::update_url_links_count();

			return true;
		}

		return false;
	}

	public function is_stat_locked( $transient_name, $max_time = 0 ): bool {
		$val = get_transient( $transient_name );
		if ( false === $val ) {
			return false;
		}

		if ( 0 === $max_time ) {
			return true;
		}

		if ( ( time() - $val ) < $max_time ) {
			return true;
		}

		delete_transient( $transient_name );

		return false;
	}

	public function init_stat_lock( $transient_name ): bool {
		return set_transient( $transient_name, time(), rand( 12 * 60 * 60, 24 * 60 * 60 ) );
	}
}
