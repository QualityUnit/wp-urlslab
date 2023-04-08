<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Optimize_Cron extends Urlslab_Cron {
	public const ONE_DAY_SECONDS = 86400;
	public const DELETE_LIMIT = 1000;
	private Urlslab_Widget $widget;

	public function get_description(): string {
		return __( 'Optimizing database size', 'urlslab' );
	}

	protected function execute(): bool {
		return $this->execute_db_optimizations() || $this->execute_redirect_logs_optimizations();
	}

	protected function execute_redirect_logs_optimizations(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Redirects::SLUG ) ) {
			return false;
		}

		global $wpdb;
		$tbl_name = URLSLAB_NOT_FOUND_LOG_TABLE;
		$limit = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Redirects::SLUG )->get_option( Urlslab_Redirects::SETTING_NAME_LOG_HISTORY_MAX_ROWS );
		if ( $limit > 0 ) {
			$row = $wpdb->get_row( "SELECT count(*) as cnt FROM {$tbl_name}", ARRAY_A );    // phpcs:ignore
			if ( isset( $row['cnt'] ) && ( (int) $row['cnt'] ) > $limit ) {
				$wpdb->query( "TRUNCATE {$tbl_name}" );    // phpcs:ignore

				return false; // no need to execute anything else
			}
		}

		$limit = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Redirects::SLUG )->get_option( Urlslab_Redirects::SETTING_NAME_LOG_HISTORY_MAX_TIME );
		if ( 0 < $limit ) {
			$wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$tbl_name} WHERE updated < %s LIMIT %d",// phpcs:ignore
					Urlslab_Data::get_now( time() - $limit ),
					self::DELETE_LIMIT
				)
			);
		}

		return false;
	}

	protected function execute_db_optimizations(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Optimize::SLUG ) ) {
			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Optimize::SLUG );

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_REVISIONS )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_revisions();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_AUTODRAFTS )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_auto_drafts();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRASHED )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_trashed();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ALL_TRANSIENT )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_all_transient();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING );
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRANSIENT_EXPIRED )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_expired_transient();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_orphaned_rel_data();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_COMMENT_META )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->optimize_orphaned_comment_metadata();
			if ( self::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( self::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING );
			}
		}

		return false;
	}

	private function extend_timestamp_option( $option_name ) {
		$this->widget->update_option( $option_name, Urlslab_Data::get_now( time() + $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_OPTIMIZATION_FREQUENCY ) ) );
	}

	/**
	 * convert value of option (in days) to mysql string used in where.
	 *
	 * @param mixed $option_name
	 *
	 * @return string
	 */
	private function get_ttl( $option_name ) {
		return Urlslab_Data::get_now( time() - self::ONE_DAY_SECONDS * $this->widget->get_option( $option_name ) );
	}

	private function optimize_revisions() {
		global $wpdb;
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_REVISION_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_type='revision' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_auto_drafts() {
		global $wpdb;
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_AUTODRAFT_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_trashed() {
		global $wpdb;
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_TRASHED_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'trash' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_expired_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '%_transient_timeout_%' LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_all_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '%_transient_%' LIMIT %d ", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_orphaned_rel_data() {
		global $wpdb;
		$table = $wpdb->prefix . 'term_relationships';
		$table_posts = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE term_taxonomy_id=1 AND object_id NOT IN (SELECT id FROM {$table_posts}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	private function optimize_orphaned_comment_metadata() {
		global $wpdb;
		$table = $wpdb->prefix . 'commentmeta';
		$table_comments = $wpdb->prefix . 'comments';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE comment_id NOT IN (SELECT comment_id FROM {$table_comments}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}
}
