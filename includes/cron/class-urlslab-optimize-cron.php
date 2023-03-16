<?php
require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Optimize_Cron extends Urlslab_Cron {
	const ONE_DAY_SECONDS = 86400;
	private Urlslab_Widget $widget;
	const DELETE_LIMIT = 1000;

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Optimize::SLUG ) ) {
			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Optimize::SLUG );

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_REVISIONS ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_revisions();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_AUTODRAFTS ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_auto_drafts();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRASHED ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_trashed();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ALL_TRANSIENT ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_all_transient();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING );
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRANSIENT_EXPIRED ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_expired_transient();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_orphaned_rel_data();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_COMMENT_META ) &&
			strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_orphaned_comment_metadata();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			} else if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING );
			}
		}

		return false;
	}

	private function extend_timestamp_option( $option_name ) {
		$this->widget->update_option( $option_name, Urlslab_Data::get_now( time() + $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_OPTIMIZATION_FREQUENCY ) ) );
	}

	/**
	 * convert value of option (in days) to mysql string used in where
	 *
	 * @param $option_name
	 *
	 * @return string
	 */
	private function get_ttl( $option_name ) {
		return Urlslab_Data::get_now( time() - self::ONE_DAY_SECONDS * $this->widget->get_option( $option_name ) );
	}

	private function optimize_revisions() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_REVISION_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_type='revision' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_auto_drafts() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_AUTODRAFT_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_trashed() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_TRASHED_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE post_status = 'trash' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_expired_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE option_name LIKE '%_transient_timeout_%' LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_all_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE option_name LIKE '%_transient_%' LIMIT %d ", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_orphaned_rel_data() {
		global $wpdb;
		$table       = $wpdb->prefix . 'term_relationships';
		$table_posts = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE term_taxonomy_id=1 AND object_id NOT IN (SELECT id FROM $table_posts) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_orphaned_comment_metadata() {
		global $wpdb;
		$table          = $wpdb->prefix . 'commentmeta';
		$table_comments = $wpdb->prefix . 'comments';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE comment_id NOT IN (SELECT comment_id FROM $table_comments) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function get_description(): string {
		return __( 'Optimizing database size', 'urlslab' );
	}
}
