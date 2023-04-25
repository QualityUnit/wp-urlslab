<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Optimize_Cron extends Urlslab_Cron {


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
					Urlslab_Optimize::DELETE_LIMIT
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
			$ret = $this->widget->optimize_revisions();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_AUTODRAFTS )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_auto_drafts();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRASHED )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_trashed();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ALL_TRANSIENT )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_all_transient();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING );
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_TRANSIENT_EXPIRED )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_expired_transient();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_orphaned_rel_data();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Optimize::SETTING_NAME_DEL_ORPHANED_COMMENT_META )
			&& strtotime( $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING ) ) < time()
		) {
			$ret = $this->widget->optimize_orphaned_comment_metadata();
			if ( Urlslab_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING );
			}
		}

		return false;
	}

	private function extend_timestamp_option( $option_name ) {
		$this->widget->update_option( $option_name, Urlslab_Data::get_now( time() + $this->widget->get_option( Urlslab_Optimize::SETTING_NAME_OPTIMIZATION_FREQUENCY ) ) );
	}


}
