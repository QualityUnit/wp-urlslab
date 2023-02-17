<?php

class Urlslab_Optimize extends Urlslab_Widget {

	const SLUG = 'optimize';

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;


	const SETTING_NAME_OPTIMIZATION_FREQUENCY = 'urlslab-del-freq';
	const SETTING_NAME_DEL_REVISIONS = 'urlslab-del-revisions';
	const SETTING_NAME_REVISIONS_NEXT_PROCESSING = 'urlslab-del-revisions-sleep';
	const SETTING_NAME_REVISION_TTL = 'urlslab-revisions-ttl';

	const SETTING_NAME_DEL_AUTODRAFTS = 'urlslab-del-autodrafts';
	const SETTING_NAME_AUTODRAFTS_NEXT_PROCESSING = 'urlslab-del-autodraft-sleep';
	const SETTING_NAME_AUTODRAFT_TTL = 'urlslab-autodraft-ttl';

	const SETTING_NAME_DEL_TRASHED = 'urlslab-del-trashed';
	const SETTING_NAME_TRASHED_NEXT_PROCESSING = 'urlslab-del-trashed-sleep';
	const SETTING_NAME_TRASHED_TTL = 'urlslab-trashed-ttl';

	const SETTING_NAME_DEL_TRANSIENT_EXPIRED = 'urlslab-del-exp-transient';
	const SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING = 'urlslab-del-exp-transient-sleep';


	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct() {
		$this->widget_slug        = self::SLUG;
		$this->widget_title       = __( 'WP DB Optimize' );
		$this->widget_description = __( 'Keep Wordpress database size and speed under survilence.' );
		$this->landing_page_link  = 'https://www.urlslab.com';
	}

	public function init_widget() {}


	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return $this->widget_slug;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return $this->widget_title;
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	/**
	 * @return string
	 */
	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function render_widget_overview() {}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/general.png' ) . 'general.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'optimize';
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_OPTIMIZATION_FREQUENCY,
			604800,
			false,
			__( 'Optimization Frequency' ),
			__( 'Specify period how often should be executed active optimizations.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400   => __( 'Dayly' ),
				604800  => __( 'Weekly' ),
				2419200 => __( 'Monthly' ),
				7257600 => __( 'Quarterly' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
		);

		$this->add_options_form_section( 'revisions', __( 'Cleanup post revisions' ), __( 'WordPress revisions automatically record any changes you make to pages or posts on your WP website. A new copy of a page is created every 60 seconds by default, as well as every time you click on the Save Draft, Publish, or Update buttons. Wordpress database can grow over time thanks to revisions of posts kept in the database.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_REVISIONS,
			false,
			false,
			__( 'Clean old post revisions' ),
			__( 'By activating this feature we will automatically delete all old revisions.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'revisions'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REVISION_TTL,
			30,
			false,
			__( 'Delete revision older as (days)' ),
			__( 'Define how many days should be kept revisions in the Wordpress database. After this time will be revisions deleted on the background by cron.' ),
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
			__( 'Next planned cleanup of revisions' ),
			__( 'Next cleanup of old revisions will be start at this time. If you need to do it sooner or later, just change this date time. This value is automatically extended after cleanup by 24 hours.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'revisions'
		);

		$this->add_options_form_section( 'auto-drafts', __( 'Cleanup auto-draft posts' ), __( 'WordPress automatically saves your post (or page) while you are editing it. This is called auto-draft. If you do not hit the publish/update button, then the post/page will be saved as auto-draft and any modification to your post/page will not be visible in your public site. It is vise to delete not needed auto-drafts after some time if you do not plan to publish old drafts' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_AUTODRAFTS,
			false,
			false,
			__( 'Clean old auto-drafts' ),
			__( 'By activating this feature we will automatically delete all old auto-draft posts.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'auto-drafts'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTODRAFT_TTL,
			90,
			false,
			__( 'Delete autodrafts older as (days)' ),
			__( 'Define how many days should be kept auto-draft in the Wordpress database. After this time will be auto-draft deleted on the background by cron.' ),
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
			__( 'Next planned cleanup of auto-drafts' ),
			__( 'Next cleanup of old auto-drafts starts at selected time. If you need to do it sooner or later, just change this date time. This value is automatically extended after cleanup by 24 hours.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'auto-drafts'
		);

		$this->add_options_form_section( 'trashed', __( 'Cleanup trashed posts' ), __( 'In WordPress, trash is the location where deleted posts, pages and comments are stored temporarily. It is similar to the recycle bin or trash on your computer. If you deleted an item accidentally, then you can easily recover it from the trash. It is wise to deelte trash after some time to keep database optimized.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRASHED,
			false,
			false,
			__( 'Clean old trashed posts' ),
			__( 'By activating this feature we will automatically delete all old trashed posts.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'trashed'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRASHED_TTL,
			90,
			false,
			__( 'Delete trashed posts older as (days)' ),
			__( 'Define how many days should be kept trashed posts in the Wordpress database. After this time will be trashed post deleted on the background by cron.' ),
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
			__( 'Next planned cleanup of trashed posts' ),
			__( 'Next cleanup of old trashed content starts at selected time. If you need to do it sooner or later, just change this date time. This value is automatically extended after cleanup by 24 hours.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'trashed'
		);


		$this->add_options_form_section( 'exp-transient', __( 'Cleanup expired transient options' ), __( 'In WordPress, transients are a particular way of caching data for a certain period of time. Instead of storing data in the object cache, transient data in WordPress is stored only temporarily, with the hopes that it will be updated occasionally.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DEL_TRANSIENT_EXPIRED,
			false,
			false,
			__( 'Clean expired transient options' ),
			__( 'By activating this feature we will automatically delete all expired transient options.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'exp-transient'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TRANSIENT_EXPIRED_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next planned cleanup of expired transients' ),
			__( 'Next cleanup starts at selected time. If you need to do it sooner or later, just change this date time. This value is automatically extended after cleanup by 24 hours.' ),
			self::OPTION_TYPE_DATETIME,
			false,
			null,
			'exp-transient'
		);

	}
}
