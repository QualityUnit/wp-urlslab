<?php

class Urlslab_Cron_Optimize extends Urlslab_Cron {


	private Urlslab_Widget $widget;

	public function get_description(): string {
		return __( 'Optimising database size', 'urlslab' );
	}

	protected function execute(): bool {
		if ( $this->execute_db_optimizations() || $this->execute_redirect_logs_optimizations() ) {
			return true;
		}
		$this->lock( 900, Urlslab_Cron::LOCK );

		return false;
	}

	protected function execute_redirect_logs_optimizations(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Redirects::SLUG ) ) {
			return false;
		}

		global $wpdb;
		$tbl_name = URLSLAB_NOT_FOUND_LOG_TABLE;
		$limit    = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG )->get_option( Urlslab_Widget_Redirects::SETTING_NAME_LOG_HISTORY_MAX_ROWS );
		if ( $limit > 0 ) {
			$row = $wpdb->get_row( "SELECT count(*) as cnt FROM {$tbl_name}", ARRAY_A );    // phpcs:ignore
			if ( isset( $row['cnt'] ) && ( (int) $row['cnt'] ) > $limit ) {
				$wpdb->query( "TRUNCATE {$tbl_name}" );    // phpcs:ignore

				return false; // no need to execute anything else
			}
		}

		$limit = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Redirects::SLUG )->get_option( Urlslab_Widget_Redirects::SETTING_NAME_LOG_HISTORY_MAX_TIME );
		if ( 0 < $limit ) {
			$deleted = $wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$tbl_name} WHERE updated < %s LIMIT %d",// phpcs:ignore
					Urlslab_Data::get_now( time() - $limit ),
					Urlslab_Widget_Optimize::DELETE_LIMIT
				)
			);
			if ( 0 < $deleted ) {
				return true;
			}
		}

		return false;
	}

	protected function execute_db_optimizations(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Optimize::SLUG ) ) {
			return false;
		}
		$this->widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Optimize::SLUG );

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_REVISIONS )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_revisions();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_REVISIONS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_AUTODRAFTS )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_auto_drafts();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_TRASHED )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_trashed();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_TRASHED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_ALL_TRANSIENT )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_all_transient();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING );
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_TRANSIENT_EXPIRED )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_expired_transient();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_orphaned_rel_data();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_ORPHANED_COMMENT_META )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING ) < time()
		) {
			$ret = $this->widget->optimize_orphaned_comment_metadata();
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT === $ret ) {
				return true;
			}
			if ( Urlslab_Widget_Optimize::DELETE_LIMIT > $ret ) {
				$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING );
			}
		}

		if (
			$this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA )
			&& $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA_NEXT_PROCESSING ) < time()
		) {
			$this->widget->optimize_urlslab_plugin_temporary_data();
			$this->extend_timestamp_option( Urlslab_Widget_Optimize::SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA_NEXT_PROCESSING );

			return true;
		}

		if ( $this->widget->optimize_web_vitals_table() ) {
			return true;
		}

		return false;
	}

	private function extend_timestamp_option( $option_name ) {
		$this->widget->update_option( $option_name, time() + $this->widget->get_option( Urlslab_Widget_Optimize::SETTING_NAME_OPTIMIZATION_FREQUENCY ) );
	}
}
