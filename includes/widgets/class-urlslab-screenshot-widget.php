<?php


class Urlslab_Screenshot_Widget extends Urlslab_Widget {

	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;
	private Urlslab_Admin_Page $parent_page;

	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->widget_slug              = 'urlslab-screenshot';
		$this->widget_title             = 'Screenshot';
		$this->widget_description       = 'Embed any screenshot of URL in your pages using wordpress shortcodes.';
		$this->landing_page_link        = 'https://www.urlslab.com';
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
		$this->parent_page              = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-ui-elements' );
	}

	public function init_widget( Urlslab_Loader $loader ) {
		$loader->add_action( 'init', $this, 'hook_callback', 10, 0 );
	}

	public function hook_callback() {
		add_shortcode( $this->widget_slug, array( $this, 'get_shortcode_content' ) );
	}


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
		return $this->widget_title . ' Widget';
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return $this->widget_description;
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		// normalize attribute keys, lowercase
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		// override default attributes with user attributes
		$default_alt  = 'Screenshot taken by URLSLAB.com';
		$urlslab_atts = shortcode_atts(
			array(
				'width'           => '100%',
				'height'          => '100%',
				'alt'             => $default_alt,
				'default-image'   => '',
				'url'             => 'https://www.urlslab.com',
				'screenshot-type' => 'carousel',
			),
			$atts,
			$tag
		);


		try {
			if ( ! empty( $urlslab_atts['url'] ) ) {
				$url_data = $this->urlslab_url_data_fetcher->fetch_schedule_url(
					new Urlslab_Url( $urlslab_atts['url'] )
				);

				if ( ! empty( $url_data ) && ! $url_data->is_empty() ) {
					$urlslab_atts['alt'] = $url_data->get_url_summary_text( get_option( Urlslab_Link_Enhancer::SETTING_NAME_DESC_REPLACEMENT_STRATEGY, Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY ) );

					switch ( $url_data->get_screenshot_status() ) {
						case Urlslab_Status::$recurring_update:
						case Urlslab_Status::$available:
							return $this->render_shortcode(
								$urlslab_atts['url'],
								$url_data->render_screenshot_path( $urlslab_atts['screenshot-type'] ),
								$urlslab_atts['alt'],
								$urlslab_atts['width'],
								$urlslab_atts['height'],
							);

						case Urlslab_Status::$new:
						case Urlslab_Status::$pending:
							//default url
							return $this->render_shortcode(
								$urlslab_atts['url'],
								$urlslab_atts['default-image'],
								$urlslab_atts['alt'],
								$urlslab_atts['width'],
								$urlslab_atts['height'],
							);

						case Urlslab_Status::$not_crawling:
						case Urlslab_Status::$blocked:
						default:
							return '';
					}
				}
			}
		} catch ( Exception $e ) {
			return '';
		}

		return $this->render_shortcode(
			$urlslab_atts['url'],
			$urlslab_atts['default-image'],
			$urlslab_atts['alt'],
			$urlslab_atts['width'],
			$urlslab_atts['height'],
		);

	}

	private function render_shortcode( string $url, string $src, string $alt, string $width, string $height ): string {
		if ( empty( $src ) ) {
			return ' <!-- URLSLAB image still not created for ' . $url . ' -->';
		}

		return sprintf(
			'<div class="urlslab-screenshot-container"><img src="%s" alt="%s" width="%s" height="%s"></div>',
			esc_url( $src ),
			esc_attr( $alt ),
			esc_attr( $width ),
			esc_attr( $height ),
		);
	}

	public function has_shortcode(): bool {
		return true;
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/screenshot-widget-demo.png' ) . 'screenshot-widget-demo.png';
	}

	public function get_landing_page_link(): string {
		return $this->landing_page_link;
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'screenshot-widget';
	}

	public static function update_settings( array $new_settings ) {}


	public function is_api_key_required() {
		return true;
	}

	protected function init_options() {
		// TODO: Implement init_options() method.
	}
}
