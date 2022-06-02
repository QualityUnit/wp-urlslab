<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Screenshot_Widget extends Urlslab_Widget {

	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	private Urlslab_Screenshot_Api $urlslab_screenshot_api;

	/**
	 * @param string $widget_slug
	 * @param string $widget_title
	 * @param string $widget_description
	 * @param string $landing_page_link
	 * @param Urlslab_Screenshot_Api $urlslab_screenshot_api
	 */
	public function __construct(
		string $widget_slug,
		string $widget_title,
		string $widget_description,
		string $landing_page_link,
		Urlslab_Screenshot_Api $urlslab_screenshot_api
	) {
		$this->widget_slug            = $widget_slug;
		$this->widget_title           = $widget_title;
		$this->widget_description     = $widget_description;
		$this->landing_page_link      = $landing_page_link;
		$this->urlslab_screenshot_api = $urlslab_screenshot_api;
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

	/**
	 * @return string
	 */
	public function get_admin_menu_page_slug(): string {
		return URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_page_url(): string {
		return $this->menu_page_url( URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-screenshot-display.php' );
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

	/**
	 * @param $args array the action type to take
	 *
	 * @return string url in the integration of wordpress process
	 */
	public function get_conf_page_url( $args = '' ): string {
		$main_menu_slug = URLSLAB_PLUGIN_DIR . '/admin/partials/urlslab-admin-display.php';
		$args           = wp_parse_args( $args, array() );
		$url            = $this->menu_page_url( $main_menu_slug );
		$url            = add_query_arg( array( 'component' => $this->widget_slug ), $url );

		if ( ! empty( $args ) ) {
			$url = add_query_arg( $args, $url );
		}

		return $url;
	}

	public function schedule_batch_urls( $urls ) {
		if ( $this->urlslab_screenshot_api->has_api_key() ) {
			return $this->urlslab_screenshot_api->schedule_batch( $urls );
		}

		return false;
	}

	function get_screenshot_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		// normalize attribute keys, lowercase
		$atts = array_change_key_case( (array) $atts, CASE_LOWER );

		global $wpdb;
		$table_name = $wpdb->prefix . 'urlslab_urls';

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
			$row = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM $table_name WHERE urlMd5 = %s", // phpcs:ignore
					( new Urlslab_Url( $urlslab_atts['url'] ) )->get_url_id(),
				),
				ARRAY_A
			);

			if ( null !== $row ) {
				if ( ! empty( $row['urlMetaDescription'] ) && $urlslab_atts['alt'] == $default_alt ) {
					$urlslab_atts['alt'] = $row['urlMetaDescription'];
				} else if ( ! empty( $row['urlTitle'] ) && $urlslab_atts['alt'] == $default_alt ) {
					$urlslab_atts['alt'] = $row['urlTitle'];
				}

				switch ( $row['status'] ) {
					case Urlslab::$link_status_waiting_for_update:
					case Urlslab::$link_status_available:
						return $this->render_shortcode(
							$urlslab_atts['url'],
							$this->create_url_path( $row, $urlslab_atts['screenshot-type'] ),
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
			} else {
				// no link found, insert
				//default url
				$urlslab_url = new Urlslab_Url( $urlslab_atts['url'] );
				$wpdb->query(
					$wpdb->prepare(
						'
                        INSERT INTO ' . $table_name . // phpcs:ignore
						' 
                            (urlMd5, urlName, status, updateStatusDate)
                        VALUES (%s, %s, %s, %s);
                    ',
						$urlslab_url->get_url_id(),
						$urlslab_url->get_url(),
						Urlslab::$link_status_not_scheduled,
						gmdate( 'Y-m-d H:i:s' )
					)
				);
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

	private function create_url_path( $row, $screenshot_type = 'carousel' ): string {
		switch ( $screenshot_type ) {
			case 'thumbnail':
				return sprintf(
					'https://www.urlslab.com/public/thumbnail/%s/%s/%s.jpg',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);
			case 'full-page':
				return sprintf(
					'https://www.urlslab.com/public/image/%s/%s/%s.png',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);

			case 'carousel':
			default:
				return sprintf(
					'https://www.urlslab.com/public/carousel/%s/%s/%s',
					$row['domainId'],
					$row['urlId'],
					$row['screenshotDate']
				);
		}
	}

}
