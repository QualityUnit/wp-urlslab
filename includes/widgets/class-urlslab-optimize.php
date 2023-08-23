<?php

class Urlslab_Optimize extends Urlslab_Widget {
	public const SLUG = 'optimize';
	public const DELETE_LIMIT = 1000;

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

	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Database Optimizer' );
	}

	public function get_widget_description(): string {
		return __( 'Boost your website\'s performance by automating database optimization in the background' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'frequency',
			__( 'Optimisation Frequency' ),
			__( 'Regular optimization ensures efficient database performance and avoids data overload.' ),
			array(
				self::LABEL_PERFORMANCE,
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_OPTIMIZATION_FREQUENCY,
			604800,
			false,
			__( 'Background Optimisation Frequency' ),
			__( 'Specify the frequency for background database optimization.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400   => __( 'Daily' ),
				604800  => __( 'Weekly' ),
				2419200 => __( 'Monthly' ),
				7257600 => __( 'Quarterly' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'frequency',
			array(
				self::LABEL_CRON,
			)
		);

		$this->add_options_form_section( 'revisions', __( 'Post Revisions' ), __( 'Post Revisions can rapidly bloat the database, potentially reducing site speed and elevating backup expenses.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_REVISIONS,
			false,
			false,
			__( 'Remove Post Revisions Periodically' ),
			__( 'Enable auto-deletion of revisions in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'revisions',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISION_TTL,
			30,
			false,
			__( 'Remove Revision Older Than (days)' ),
			__( 'Specify the number of days to retain revisions in the WordPress database.' ),
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
			__( 'Upcoming Scheduled Revisions Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of revisions. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			'btn_clean_post_revisions',
			'optimize/clean_post_revisions',
			false,
			__( 'Remove Post Revisions Now' ),
			__( 'Removes post revisions from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'revisions'
		);

		$this->add_options_form_section( 'auto-drafts', __( 'Auto-Draft Posts' ), __( 'Auto-drafts can accumulate in the database over extended periods and may lead to website lag if too numerous.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_AUTODRAFTS,
			false,
			false,
			__( 'Remove Auto-Drafts Periodically' ),
			__( 'Enable auto-deletion of auto-drafts in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'auto-drafts',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFT_TTL,
			30,
			false,
			__( 'Remove Auto-Drafts Older Than (days)' ),
			__( 'Specify the number of days to retain auto-drafts in the WordPress database.' ),
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
			__( 'Upcoming Scheduled Auto-Drafts Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of auto-drafts. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			'btn_clean_post_autodrafts',
			'optimize/clean_post_autodrafts',
			false,
			__( 'Remove Auto-Drafts Now' ),
			__( 'Removes auto-drafts from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'auto-drafts'
		);

		$this->add_options_form_section( 'trashed', __( 'Trashed Posts' ), __( 'The post slug is already taken. You can free it up by deleting the post - this is done automatically in the background without any hassle.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRASHED,
			false,
			false,
			__( 'Remove Trashed Posts Periodically' ),
			__( 'Enable auto-deletion of trashed posts in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'trashed',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_TTL,
			30,
			false,
			__( 'Remove Trashed Posts Older Than (days)' ),
			__( 'Specify the number of days to retain trashed posts in the WordPress database.' ),
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
			__( 'Upcoming Scheduled Trashed Posts Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of trashed posts. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			'btn_clean_post_trash',
			'optimize/clean_post_trash',
			false,
			__( 'Remove Trashed Posts Now' ),
			__( 'Removes trashed posts from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'trashed'
		);

		$this->add_options_form_section( 'transient', __( 'Transient Options' ), __( 'Transients greatly aid in the acceleration of WordPress, however, an overabundance of expired ones could hinder the website\'s speed.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRANSIENT_EXPIRED,
			false,
			false,
			__( 'Remove Expired Transient Options Periodically' ),
			__( 'Enable auto-deletion of expired transient options in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING,
			time(),
			false,
			__( 'Upcoming Scheduled Expired Transient Options Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of expired transient options. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			'btn_clean_expired_transient',
			'optimize/clean_expired_transient',
			false,
			__( 'Remove Expired Transient Options Now' ),
			__( 'Remove transient options from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ALL_TRANSIENT,
			false,
			false,
			__( 'Remove All Transient Options Periodically' ),
			__( 'Enable auto-deletion of all transient options in the background. This feature could be risky, ensure its implications before use.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING,
			time(),
			false,
			__( 'Upcoming Scheduled All Transient Options Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of all transient options. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);

		$this->add_options_form_section( 'orphaned-rel-data', __( 'Orphaned Relationship Data' ), __( 'Orphaned Relationship Data becomes an issue if you regularly remove content from WordPress. Over time, these orphaned items can accumulate in the thousands, taking up significant database space.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA,
			false,
			false,
			__( 'Remove Orphaned Relationship Data Periodically' ),
			__( 'Enable auto-deletion of orphaned relationship data in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'orphaned-rel-data',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING,
			time(),
			false,
			__( 'Upcoming Scheduled Orphaned Relationship Data Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of orphaned relationship data. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'orphaned-rel-data'
		);
		$this->add_option_definition(
			'btn_clean_orphaned_rel_data',
			'optimize/clean_orphaned_rel_data',
			false,
			__( 'Remove Orphaned Relationship Data Now' ),
			__( 'Remove orphaned relationship data from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'orphaned-rel-data'
		);

		$this->add_options_form_section( 'comments', __( 'Orphaned Comments Data' ), __( 'Meta data from orphaned comments can become an issue if you frequently remove comments from WordPress. These can accumulate into thousands over time, occupying substantial database space.' ), array( self::LABEL_PERFORMANCE ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_COMMENT_META,
			false,
			false,
			__( 'Remove Orphaned Comment Meta Data Periodically' ),
			__( 'Enable auto-deletion of orphaned comment meta data in the background.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'comments',
			array( self::LABEL_CRON )
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING,
			time(),
			false,
			__( 'Upcoming Scheduled Orphaned Comment Meta Data Cleanup' ),
			__( 'Choose the timing for the next auto-deletion of orphaned comment meta data. Utilize this feature if you want the deletion to occur earlier or later than normal.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'comments'
		);
		$this->add_option_definition(
			'btn_clean_orphaned_comment_meta',
			'optimize/clean_orphaned_comment_meta',
			false,
			__( 'Remove Orphaned Comment Meta Data Now' ),
			__( 'Remove orphaned comment meta data from the database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'comments'
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
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_REVISION_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_type='revision' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_auto_drafts() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_AUTODRAFT_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_trashed() {
		global $wpdb;
		$ttl   = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_TRASHED_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'trash' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_expired_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '%_transient_timeout_%' LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_all_transient() {
		global $wpdb;
		$table = $wpdb->prefix . 'options';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE option_name LIKE '%_transient_%' LIMIT %d ", self::DELETE_LIMIT ) ); // phpcs:ignore
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

}
