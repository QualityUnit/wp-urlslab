<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Optimize_Cron extends Urlslab_Cron {
	const ONE_DAY_SECONDS = 86400;
	const NEXT_EXECUTION = self::ONE_DAY_SECONDS;
	private Urlslab_Widget $widget;

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Optimize::SLUG ) ) {
			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Optimize::SLUG );

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_REVISIONS ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING ) ) <= time()
		) {
			$ret = $this->optimize_revisions();
			if ( is_numeric( $ret ) && $ret > 0 ) {
				return true;
			} else if ( 0 === $ret ) {
				$this->widget->update_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING, Urlslab_Data::get_now( time() + self::NEXT_EXECUTION ) );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_AUTODRAFTS ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING ) ) <= time()
		) {
			$ret = $this->optimize_auto_drafts();
			if ( is_numeric( $ret ) && $ret > 0 ) {
				return true;
			} else if ( 0 === $ret ) {
				$this->widget->update_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING, Urlslab_Data::get_now( time() + self::NEXT_EXECUTION ) );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRASHED ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING ) ) <= time()
		) {
			$ret = $this->optimize_trashed();
			if ( is_numeric( $ret ) && $ret > 0 ) {
				return true;
			} else if ( 0 === $ret ) {
				$this->widget->update_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING, Urlslab_Data::get_now( time() + self::NEXT_EXECUTION ) );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRANSIENT_EXPIRED ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING ) ) <= time()
		) {
			$ret = $this->optimize_expired_transient();
			if ( is_numeric( $ret ) && $ret > 0 ) {
				return true;
			} else if ( 0 === $ret ) {
				$this->widget->update_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING, Urlslab_Data::get_now( time() + self::NEXT_EXECUTION ) );
			}
		}

		return false;
	}

	private function optimize_revisions() {
		global $wpdb;
		$ttl   = Urlslab_Data::get_now( time() - self::ONE_DAY_SECONDS * $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REVISION_TTL ) );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_type='revision' AND post_modified < %s LIMIT 1000", $ttl ) ); // phpcs:ignore
	}

	private function optimize_auto_drafts() {
		global $wpdb;
		$ttl   = Urlslab_Data::get_now( time() - self::ONE_DAY_SECONDS * $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFT_TTL ) );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT 1000", $ttl ) ); // phpcs:ignore
	}

	private function optimize_trashed() {
		global $wpdb;
		$ttl   = Urlslab_Data::get_now( time() - self::ONE_DAY_SECONDS * $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRASHED_TTL ) );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_status = 'trash' AND post_modified < %s LIMIT 1000", $ttl ) ); // phpcs:ignore
	}

	private function optimize_expired_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE option_name LIKE '%_transient_timeout_%' LIMIT 1000" ) ); // phpcs:ignore
	}
}
