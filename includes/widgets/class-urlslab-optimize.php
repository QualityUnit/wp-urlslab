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
		return __( 'Boost the performance of your website by automating database optimization in the background' );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'frequency', __( 'Frequency' ), __( 'Regular optimization will help keep your database performing efficiently and prevent data bloat.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_OPTIMIZATION_FREQUENCY,
			604800,
			false,
			__( 'Background Optimisation Frequency' ),
			__( 'Define how often we should optimize the database in the background.' ),
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
			'frequency'
		);

		$this->add_options_form_section( 'revisions', __( 'Post Revisions' ), __( 'Post Revisions can quickly overfill the database, making the website much slower and even more expensive to back up.' ) );
		$this->add_option_definition(
			'btn_clean_post_revisions',
			'optimize/clean_post_revisions',
			false,
			__( 'Clean Old Post Revisions Now' ),
			__( 'Deletes old post revisions from database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_REVISIONS,
			false,
			false,
			__( 'Clean Old Post Revisions Periodically' ),
			__( 'Enable automatic background deleting of all old revisions.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISION_TTL,
			30,
			false,
			__( 'Delete Revision Older as (days)' ),
			__( 'Define how many days the revisions should be kept in the WordPress database.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISIONS_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Revisions' ),
			__( 'Select when the next automatic background deleting of all old revisions should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'revisions'
		);

		$this->add_options_form_section( 'auto-drafts', __( 'Auto-Draft Posts' ), __( 'Auto-Drafts are stored in the database over weeks or months. When there are too many of them, it can slow down the website.' ) );
		$this->add_option_definition(
			'btn_clean_auto_drafts',
			'optimize/clean_auto_drafts',
			false,
			__( 'Clean Old Auto-Drafts Now' ),
			__( 'Deletes old auto drafts from database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_AUTODRAFTS,
			false,
			false,
			__( 'Clean Old Auto-Drafts Periodically' ),
			__( 'Enable automatic background deleting of all old auto-drafts.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFT_TTL,
			30,
			false,
			__( 'Delete Auto-Drafts Older as (days)' ),
			__( 'Define how many days auto-drafts should be kept in the WordPress database.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Auto-Drafts' ),
			__( 'Select when the next automatic background deleting of all old auto-drafts should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'auto-drafts'
		);

		$this->add_options_form_section( 'trashed', __( 'Trashed Posts' ), __( 'The post slug is reserved, and there is no way to use it till you delete the post. So keep this process automatic in the background without effort.' ) );
		$this->add_option_definition(
			'btn_clean_trashed_posts',
			'optimize/clean_trashed_posts',
			false,
			__( 'Clean Trashed Posts Now' ),
			__( 'Deletes trashed posts from database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRASHED,
			false,
			false,
			__( 'Clean Old Trashed Posts Periodically' ),
			__( 'Enable automatic background deleting of all old trashed posts.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_TTL,
			30,
			false,
			__( 'Delete Trashed Posts Older as (days)' ),
			__( 'Define how many days trashed posts should be kept in the WordPress database.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			},
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Trashed Posts' ),
			__( 'Select when the next automatic background deleting of all old trashed posts should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'trashed'
		);

		$this->add_options_form_section( 'transient', __( 'Transient Options' ), __( 'Transients are extremely helpful, and they are making WordPress faster. Unfortunately, too many of them are expired, which can slow down the website\'s speed.' ) );
		$this->add_option_definition(
			'btn_clean_transients',
			'optimize/clean_transients',
			false,
			__( 'Clean Transient Options Now' ),
			__( 'Deletes transient options from database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRANSIENT_EXPIRED,
			false,
			false,
			__( 'Clean Just Expired Transient Options Periodically' ),
			__( 'Enable automatic background deleting of all expired transient options.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Expired Transient Options' ),
			__( 'Select when the next automatic background deleting of all expired transient options should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DEL_ALL_TRANSIENT,
			false,
			false,
			__( 'Clean All Transient Options Periodically' ),
			__( 'Enable automatic background deleting of all transient options. This setting can be dangerous; you should know what you are doing by enabling it. We recommend even backing up the database regularly before enabling it.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ALL_TRANSIENT_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of All Transient Options' ),
			__( 'Select when the next automatic background deleting of all transient options should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'transient'
		);

		$this->add_options_form_section( 'orphaned-rel-data', __( 'Orphaned Relationship Data' ), __( 'Orphaned Relationship Data are a problem only if you often delete the content from WordPress. Over time, you can have thousands of these items in the database, which consumes a lot of space.' ) );
		$this->add_option_definition(
			'btn_clean_orphaned_relationship_data',
			'optimize/clean_orphaned_relationship_data',
			false,
			__( 'Clean Orphaned Relationship Data Now' ),
			__( 'Deletes orphaned relationship data from database.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'orphaned-rel-data'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_RELATIONSHIP_DATA,
			false,
			false,
			__( 'Clean Orphaned Relationship Data Periodically' ),
			__( 'Enable automatic background deleting of all orphaned relationship data.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'orphaned-rel-data'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_RELATIONSHIP_DATA_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Orphaned Relationship Data' ),
			__( 'Select when the next automatic background deleting of all orphaned relationship data should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'orphaned-rel-data'
		);

		$this->add_options_form_section( 'comments', __( 'Orphaned Comments Data' ), __( 'Orphaned Comments MetaData are a problem only if you often delete comments from WordPress. Over time, you can have thousands of these items in the database, which consumes a lot of space.' ) );
		$this->add_option_definition(
			'btn_clean_orphaned_comment_meta',
			'optimize/clean_orphaned_comment_meta',
			false,
			__( 'Clean Orphaned Comment Meta Data Now' ),
			__( 'Delete all orphaned comment meta data.' ),
			self::OPTION_TYPE_BUTTON_API_CALL,
			false,
			null,
			'comments'
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEL_ORPHANED_COMMENT_META,
			false,
			false,
			__( 'Clean Orphaned Comment Meta Data Periodically' ),
			__( 'Enable automatic background deleting of all orphaned comment meta data.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'comments'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ORPHANED_COMMENT_META_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next Planned Cleanup of Orphaned Comment Meta Data' ),
			__( 'Select when the next automatic background deleting of all orphaned comment meta data should happen. It can be used if you need to use it earlier than usual or if you need to postpone the action to a specific time.' ),
			self::OPTION_TYPE_DATETIME,
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
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_REVISION_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_type='revision' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_auto_drafts() {
		global $wpdb;
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_AUTODRAFT_TTL );
		$table = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE post_status = 'auto-draft' AND post_modified < %s LIMIT %d", $ttl, self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_trashed() {
		global $wpdb;
		$ttl = $this->get_ttl( Urlslab_Optimize::SETTING_NAME_TRASHED_TTL );
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
		$table = $wpdb->prefix . 'term_relationships';
		$table_posts = $wpdb->prefix . 'posts';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE term_taxonomy_id=1 AND object_id NOT IN (SELECT id FROM {$table_posts}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

	public function optimize_orphaned_comment_metadata() {
		global $wpdb;
		$table = $wpdb->prefix . 'commentmeta';
		$table_comments = $wpdb->prefix . 'comments';

		return $wpdb->query( $wpdb->prepare( "DELETE FROM {$table} WHERE comment_id NOT IN (SELECT comment_id FROM {$table_comments}) LIMIT %d", self::DELETE_LIMIT ) ); // phpcs:ignore
	}

}
