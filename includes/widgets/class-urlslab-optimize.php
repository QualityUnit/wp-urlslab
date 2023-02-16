<?php

class Urlslab_Optimize extends Urlslab_Widget {

	const SLUG = 'optimize';

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;


	const SETTING_NAME_REMOVE_REVISIONS = 'urlslab-remove-revisions';
	const SETTING_NAME_REMOVE_REVISIONS_NEXT_PROCESSING = 'urlslab-remove-revisions_sleep';
	const SETTING_NAME_TTL = 'urlslab-revisions-ttl';

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
			self::SETTING_NAME_REMOVE_REVISIONS,
			false,
			false,
			__( 'Remove old revisions' ),
			__( 'Wordpress database can grow over time thanks to all revisions kept in the database. By activating this feature we will automatically delete all older revisions.' )
		);
		$this->add_option_definition(
			self::SETTING_NAME_TTL,
			30,
			false,
			__( 'Delete revision older as [days]' ),
			__( 'Define how many days should be kept revisions in the Wordpress database.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 365 > $value && 0 < $value;
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_REVISIONS_NEXT_PROCESSING,
			Urlslab_Data::get_now(),
			false,
			__( 'Next processing of old revisions' ),
			__( 'Next cleanup of old revisions will be executed on specified time. If you need to do it sooner or later, just change this date time.' ),
			self::OPTION_TYPE_DATETIME,
			false
		);
	}
}
