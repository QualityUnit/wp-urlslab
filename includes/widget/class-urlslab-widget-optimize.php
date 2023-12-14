<?php

class Urlslab_Widget_Optimize extends Urlslab_Widget {
	public const SLUG = 'optimize';
	public const DELETE_LIMIT = 10000;

	public const SETTING_NAME_OPTIMIZATION_FREQUENCY = 'urlslab-del-freq';
	public const SETTING_NAME_DEL_REVISIONS = 'urlslab-del-revisions';
	public const SETTING_NAME_REVISIONS_NEXT_PROCESSING = 'urlslab-del-revisions-sleep';
	public const SETTING_NAME_REVISION_TTL = 'urlslab-revisions-ttl';

	public const SETTING_NAME_DEL_AUTODRAFTS = 'urlslab-del-autodrafts';
	public const SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING = 'urlslab-del-autodraft-sleep';
	public const SETTING_NAME_AUTODRAFT_TTL = 'urlslab-autodraft-ttl';

	public const SETTING_NAME_DEL_TRASHED = 'urlslab-del-trashed';
	public const SETTING_NAME_TRASHED_NEXT_PROCESSING = 'urlslab-del-trashed-sleep';
	public const SETTING_NAME_TRASHED_TTL = 'urlslab-trashed-ttl';

	public const SETTING_NAME_DEL_ALL_TRANSIENT = 'urlslab-del-all-transient';
	public const SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING = 'urlslab-del-all-transient-sleep';
	public const SETTING_NAME_DEL_TRANSIENT_EXPIRED = 'urlslab-del-exp-transient';
	public const SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING = 'urlslab-del-exp-transient-sleep';
	public const SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA = 'urlslab-del-orph-rels';
	public const SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING = 'urlslab-del-orph-rels-sleep';
	public const SETTING_NAME_DEL_ORPHANED_COMMENT_META = 'urlslab-del-orph-com-meta';
	public const SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING = 'urlslab-del-orph-com-meta-sleep';
	public const SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA = 'urlslab-del-urlslab-temporary-data';
	const SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA_NEXT_PROCESSING = 'urlslab-del-urlslab-temporary-data-sleep';

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Database Optimisations', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Boost your website\'s performance by automating database optimization in the background', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function init_wp_admin_menu( string $plugin_name, WP_Admin_Bar $wp_admin_bar ) {
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG,
				'parent' => Urlslab_Widget::MENU_ID,
				'title'  => __( 'Optimize WordPress DB', 'urlslab' ),
				'href'   => admin_url( 'admin.php?page=urlslab-dashboard#/Optimize' ),
			)
		);

		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_post_revisions',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Post Revisions', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_post_revisions', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_post_autodrafts',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Auto-Drafts', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_post_autodrafts', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_post_trash',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Trashed Posts', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_post_trash', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_expired_transient',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Expired Transient Options', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_expired_transient', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_all_transient',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete All Transient Options', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_all_transient', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_orphaned_rel_data',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Orphaned Relationship Data', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_orphaned_rel_data', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_orphaned_comment_meta',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete Orphaned Comment Meta Data', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_orphaned_comment_meta', 'GET' ) ),
			)
		);
		$wp_admin_bar->add_menu(
			array(
				'id'     => $this::SLUG . '-clean_urlslab_temp_data',
				'parent' => $this::SLUG,
				'title'  => __( 'Delete URLsLab plugin transient data', 'urlslab' ),
				'href'   => '#',
				'meta'   => array( 'onclick' => $this->get_on_click_api_call( 'optimize/clean_urlslab_temp_data', 'GET' ) ),
			)
		);
	}


	protected function add_options() {
		$this->add_options_form_section(
			'frequency',
			function() {
				return __( 'Optimisation Frequency', 'urlslab' );
			},
			function() {
				return __( 'Regular optimization ensures efficient database performance and avoids data overload.', 'urlslab' );
			},
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_OPTIMIZATION_FREQUENCY,
			604800,
			false,
			function() {
				return __( 'Background Optimisation Frequency', 'urlslab' );
			},
			function() {
				return __( 'Specify the frequency for background database optimization.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function() {
				return array(
					86400   => __( 'Daily', 'urlslab' ),
					604800  => __( 'Weekly', 'urlslab' ),
					2419200 => __( 'Monthly', 'urlslab' ),
					7257600 => __( 'Quarterly', 'urlslab' ),
				);
			},
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'frequency'
		);

		$this->add_options_form_section(
			'revisions',
			function() {
				return __( 'Post Revisions', 'urlslab' );
			},
			function() {
				return __( 'Post Revisions can rapidly bloat the database, potentially reducing site speed and elevating backup expenses.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_REVISIONS,
			false,
			false,
			function() {
				return __( 'Remove Post Revisions Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of revisions in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISION_TTL,
			14,
			false,
			function() {
				return __( 'Remove Revision Older Than (days)', 'urlslab' );
			},
			function() {
				return __( 'Specify the number of days to retain revisions in the WordPress database.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISIONS_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Revisions Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of revisions. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			'btn_clean_post_revisions',
			'optimize/clean_post_revisions',
			false,
			function() {
				return __( 'Remove Post Revisions Now', 'urlslab' );
			},
			function() {
				return __( 'Removes post revisions from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'revisions'
		);

		$this->add_options_form_section(
			'auto-drafts',
			function() {
				return __( 'Auto-Draft Posts', 'urlslab' );
			},
			function() {
				return __( 'Auto-drafts can accumulate in the database over extended periods and may lead to website lag if too numerous.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_AUTODRAFTS,
			false,
			false,
			function() {
				return __( 'Remove Auto-Drafts Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of auto-drafts in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFT_TTL,
			14,
			false,
			function() {
				return __( 'Remove Auto-Drafts Older Than (days)', 'urlslab' );
			},
			function() {
				return __( 'Specify the number of days to retain auto-drafts in the WordPress database.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Auto-Drafts Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of auto-drafts. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			'btn_clean_post_autodrafts',
			'optimize/clean_post_autodrafts',
			false,
			function() {
				return __( 'Remove Auto-Drafts Now', 'urlslab' );
			},
			function() {
				return __( 'Removes auto-drafts from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'auto-drafts'
		);

		$this->add_options_form_section(
			'trashed',
			function() {
				return __( 'Trashed Posts', 'urlslab' );
			},
			function() {
				return __( 'The post slug is already taken. You can free it up by deleting the post - this is done automatically in the background without any hassle.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRASHED,
			false,
			false,
			function() {
				return __( 'Remove Trashed Posts Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of trashed posts in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_TTL,
			7,
			false,
			function() {
				return __( 'Remove Trashed Posts Older Than (days)', 'urlslab' );
			},
			function() {
				return __( 'Specify the number of days to retain trashed posts in the WordPress database.', 'urlslab' );
			},
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Trashed Posts Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of trashed posts. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			'btn_clean_post_trash',
			'optimize/clean_post_trash',
			false,
			function() {
				return __( 'Remove Trashed Posts Now', 'urlslab' );
			},
			function() {
				return __( 'Removes trashed posts from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'trashed'
		);

		$this->add_options_form_section(
			'transient',
			function() {
				return __( 'Transient Options', 'urlslab' );
			},
			function() {
				return __( 'Transients greatly aid in the acceleration of WordPress, however, an overabundance of expired ones could hinder the website\'s speed.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRANSIENT_EXPIRED,
			false,
			false,
			function() {
				return __( 'Remove Expired Transient Options Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of expired transient options in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Expired Transient Options Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of expired transient options. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			'btn_clean_expired_transient',
			'optimize/clean_expired_transient',
			false,
			function() {
				return __( 'Remove Expired Transient Options Now', 'urlslab' );
			},
			function() {
				return __( 'Remove transient options from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ALL_TRANSIENT,
			false,
			false,
			function() {
				return __( 'Remove All Transient Options Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of all transient options in the background. This feature could be risky, ensure its implications before use.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient',
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled All Transient Options Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of all transient options. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);

		$this->add_options_form_section(
			'orphaned-rel-data',
			function() {
				return __( 'Orphaned Relationship Data', 'urlslab' );
			},
			function() {
				return __( 'Orphaned Relationship Data becomes an issue if you regularly remove content from WordPress. Over time, these orphaned items can accumulate in the thousands, taking up significant database space.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA,
			false,
			false,
			function() {
				return __( 'Remove Orphaned Relationship Data Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of orphaned relationship data in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'orphaned-rel-data'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Orphaned Relationship Data Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of orphaned relationship data. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'orphaned-rel-data'
		);
		$this->add_option_definition(
			'btn_clean_orphaned_rel_data',
			'optimize/clean_orphaned_rel_data',
			false,
			function() {
				return __( 'Remove Orphaned Relationship Data Now', 'urlslab' );
			},
			function() {
				return __( 'Remove orphaned relationship data from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'orphaned-rel-data'
		);

		$this->add_options_form_section(
			'comments',
			function() {
				return __( 'Orphaned Comments Data', 'urlslab' );
			},
			function() {
				return __( 'Meta data from orphaned comments can become an issue if you frequently remove comments from WordPress. These can accumulate into thousands over time, occupying substantial database space.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_COMMENT_META,
			false,
			false,
			function() {
				return __( 'Remove Orphaned Comment Meta Data Periodically', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of orphaned comment meta data in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'comments'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled Orphaned Comment Meta Data Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of orphaned comment meta data. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'comments'
		);
		$this->add_option_definition(
			'btn_clean_orphaned_comment_meta',
			'optimize/clean_orphaned_comment_meta',
			false,
			function() {
				return __( 'Remove Orphaned Comment Meta Data Now', 'urlslab' );
			},
			function() {
				return __( 'Remove orphaned comment meta data from the database.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'comments'
		);


		$this->add_options_form_section(
			'urlslab',
			function() {
				return __( 'Urlslab temporary data', 'urlslab' );
			},
			function() {
				return __( 'URLsLab plugin store in database some temporary data, which is good to delete time to time. We store them mainly for debugging purpouses.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA,
			false,
			false,
			function() {
				return __( 'Remove URLsLab temporary data', 'urlslab' );
			},
			function() {
				return __( 'Enable auto-deletion of plugin temporary data in the background.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'urlslab'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_URLSLAB_TEMPORARY_DATA_NEXT_PROCESSING,
			time(),
			false,
			function() {
				return __( 'Upcoming Scheduled URLsLab temp data Cleanup', 'urlslab' );
			},
			function() {
				return __( 'Choose the timing for the next auto-deletion of temporary data. Utilize this feature if you want the deletion to occur earlier or later than normal.', 'urlslab' );
			},
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'urlslab'
		);
		$this->add_option_definition(
			'btn_clean_urlslab_temp_data',
			'optimize/clean_urlslab_temp_data',
			false,
			function() {
				return __( 'Remove Temporary Data Now', 'urlslab' );
			},
			function() {
				return __( 'Remove plugin temporary data from the database now.', 'urlslab' );
			},
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'urlslab'
		);

	}


	/**
	 * convert value of option (in days) to mysql string used in where.
	 *
	 * @param mixed $option_name
	 *
	 * @return string
	 */
	private function get_ttl( $option_name ) {
		return Urlslab_Data::get_now( time() - 86400 * $this->get_option( $option_name ) );
	}

	public function optimize_revisions() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Widget_Optimize::SETTING_NAME_REVISION_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_type='revision' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_auto_drafts() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Widget_Optimize::SETTING_NAME_AUTODRAFT_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_trashed() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Widget_Optimize::SETTING_NAME_TRASHED_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'trash' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_expired_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		$deleted_options = $wpdb->get_results( $wpdb->prepare( "SELECT option_name FROM {$table} WHERE option_name LIKE %s AND option_value<%d LIMIT %d", '_transient_timeout_%', time(), self::DELETE_LIMIT ), ARRAY_A ); // phpcs:ignore

		if ( ! empty( $deleted_options ) ) {
			foreach ( $deleted_options as $option ) {
				$wpdb->delete( $table, array( 'option_name' => str_replace( '_transient_timeout_', '_transient_', $option['option_name'] ) ) );
				$wpdb->delete( $table, array( 'option_name' => $option['option_name'] ) );
			}

			return count( $deleted_options );
		}

		return 0;
	}

	public function optimize_all_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '_transient_%' LIMIT %d ", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_orphaned_rel_data() {
		global $wpdb;
		$table       = $wpdb->prefix . 'term_relationships';
		$table_posts = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE term_taxonomy_id=1 AND object_id NOT IN (SELECT id FROM {$table_posts}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_orphaned_comment_metadata() {
		global $wpdb;
		$table          = $wpdb->prefix . 'commentmeta';
		$table_comments = $wpdb->prefix . 'comments';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE comment_id NOT IN (SELECT comment_id FROM {$table_comments}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_urlslab_plugin_temporary_data() {
		global $wpdb;

		$table = $wpdb->prefix . 'options';
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '_transient_urlslab_%' OR option_name LIKE '_transient_timeout_urlslab_%' OR option_name LIKE '_transient_url_cache_%' LIMIT %d ", self::DELETE_LIMIT ) ); // phpcs:ignore

		return $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_TASKS_TABLE ) ) && // phpcs:ignore
			   $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KW_URL_INTERSECTIONS_TABLE ) ) && // phpcs:ignore
			   $wpdb->query( $wpdb->prepare( 'TRUNCATE ' . URLSLAB_KW_INTERSECTIONS_TABLE ) ); // phpcs:ignore
	}

	public function optimize_web_vitals_table() {
		global $wpdb;
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Web_Vitals::SLUG ) ) {
			return 0;
		}

		if ( get_transient( 'urlslab_optimize_web_vitals_table' ) ) {
			return 0;
		}

		$result = $wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . URLSLAB_WEB_VITALS_TABLE . ' WHERE created < %s LIMIT %d', // phpcs:ignore
				Urlslab_Data::get_now( time() - Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Web_Vitals::SLUG )->get_option( Urlslab_Widget_Web_Vitals::SETTING_NAME_WEB_VITALS_LOG_TTL ) * 3600 ),
				self::DELETE_LIMIT
			)
		);

		if ( ! $result ) {
			set_transient( 'urlslab_optimize_web_vitals_table', true, 3600 );
		}

		return $result;
	}

	public function register_routes() {
		( new Urlslab_Api_Optimize() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'Tools' => __( 'Tools', 'urlslab' ) );
	}
}
