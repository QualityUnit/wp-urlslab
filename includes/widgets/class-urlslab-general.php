<?php

// phpcs:disable WordPress

class Urlslab_General extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;


	const SETTING_NAME_URLSLAB_API_KEY = 'urlslab-api-key';

	/**
	 * @param Urlslab_Url_Data_Fetcher $url_data_fetcher
	 */
	public function __construct() {
		$this->widget_slug        = 'general';
		$this->widget_title       = __( 'General Settings' );
		$this->widget_description = __( 'Urlslab connector' );
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
		return 'general';
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_URLSLAB_API_KEY,
			'',
			true,
			__( 'API Key' ),
			__( 'Urlslab API key you can get from <a href="https://www.urlslab.com" target="_blank">https://www.urlslab.com</a>' ),
			self::OPTION_TYPE_PASSWORD
		);
	}
}
