<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Screenshot_Widget extends Urlslab_Widget {

	private string $widget_slug = 'urlslab-screenshot';

	private string $widget_title = 'Screenshot';

	private string $widget_description = 'Urlslab Widget to integrate any screenshot of other websites on your website';

	private string $landing_page_link = 'https://www.urlslab.com';

	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;

	private Urlslab_Screenshot_Table $screenshot_table;

	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
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
		return 'Urlslab ' . $this->widget_title;
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

	public function load_widget_page() {
		?>
		<div class="wrap">
			<h2>Screenshots</h2>
			<?php
			$this->screenshot_table->prepare_items();
			$this->screenshot_table->display();
			?>

		</div>
		<?php
	}

	public function widget_admin_load() {
		$option = 'per_page';
		$args = array(
			'label' => 'Urls',
			'default' => 5,
			'option' => 'users_per_page',
		);

		add_screen_option( $option, $args );

		$this->screenshot_table = new Urlslab_Screenshot_Table();
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_title(): string {
		return 'Urlslab Widget | Screenshot';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Screenshots';
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


		if ( ! empty( $urlslab_atts['url'] ) ) {
			$url_data = $this->urlslab_url_data_fetcher->fetch_schedule_url(
				new Urlslab_Url( $urlslab_atts['url'] )
			);

			if ( ! empty( $url_data ) && ! $url_data->is_empty() ) {
				$urlslab_atts['alt'] = $url_data->get_url_summary_text();

				switch ( $url_data->get_screenshot_status() ) {
					case Urlslab::$link_status_waiting_for_update:
					case Urlslab::$link_status_available:
						return $this->render_shortcode(
							$urlslab_atts['url'],
							$url_data->render_screenshot_path( $urlslab_atts['screenshot-type'] ),
							$urlslab_atts['alt'],
							$urlslab_atts['width'],
							$urlslab_atts['height'],
						);

					case Urlslab::$link_status_not_scheduled:
					case Urlslab::$link_status_waiting_for_screenshot:
						//default url
						return $this->render_shortcode(
							$urlslab_atts['url'],
							$urlslab_atts['default-image'],
							$urlslab_atts['alt'],
							$urlslab_atts['width'],
							$urlslab_atts['height'],
						);

					case Urlslab::$link_status_broken:
					default:
						return '';
				}
			}
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
}
