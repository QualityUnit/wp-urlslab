<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;


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
		return 'Urlslab Widget | Link Enhancer';
	}

	/**
	 * @return string
	 */
	public function get_admin_menu_title(): string {
		return 'Link Enhancer';
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


	public function theContentHook($content)
	{
		$dom = new DOMDocument();
		$dom->strictErrorChecking = false;
		try {
			$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
			$elements = $dom->getElementsByTagName('a');

			if ($elements instanceof DOMNodeList) {
				foreach ($elements as $domElement) {
					if (!strlen($domElement->getAttribute('title')) && strlen($domElement->getAttribute('href'))) {
						$domElement->setAttribute('title', 'new title');
					}
				}
			}
			return $dom->saveHTML();
		} catch (Exception $e) {
			return $content . "\n" . "<!---\n Error:" . str_replace(">", ' ', $e->getMessage()) . "\n--->";
		}
	}
}
