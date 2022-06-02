<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	private int $max_url_enhance_cnt = 100;


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


	public function theContentHook( $content ) {
		if ( ! strlen( trim( $content ) ) ) {
			return $content;    //nothing to process
		}

		$document = new DOMDocument();
		$document->strictErrorChecking = false;
		$libxml_previous_state = libxml_use_internal_errors( true );
		try {
			$document->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );

			$elements = $document->getElementsByTagName( 'a' );


			$elements_to_enhance = array();
			if ( $elements instanceof DOMNodeList ) {
				foreach ( $elements as $dom_element ) {
					//skip processing if A tag contains attribute "urlslab-skip"
					if ( $dom_element->hasAttribute( 'urlslab-skip' ) ) {
						continue;
					}

					if ( ! strlen( $dom_element->getAttribute( 'title' ) ) && strlen( $dom_element->getAttribute( 'href' ) ) ) {
						$elements_to_enhance[] = $dom_element;
					}
				}
			}


			if ( ! empty( $elements_to_enhance ) ) {

				$values = array();
				$insert_place_holders = array();
				$select_url_md5_array = array();
				$update_time = time();
				for ( $i = 0; $i <= min( $this->max_url_enhance_cnt, count( $elements_to_enhance ) ); $i++ ) {
					$url = new Urlslab_Url( $elements_to_enhance[ $i ]->hasAttribute( 'href' ) );
					array_push( $values, $url->get_url_id(), $url->get_url(), Urlslab::$link_status_not_scheduled, $update_time );
					$insert_place_holders[] = '(%s, %s, %s, %s)';
					$select_url_md5_array[] = $url->get_url_id();

				}

				global $wpdb;
				$screenshot_table = $wpdb->prefix . 'urlslab_screenshot';
				$select_placeholders = implode( ', ', array_fill( 0, count( $values ), '%s' ) );
				$insert_sql = 'INSERT IGNORE INTO ' . $screenshot_table .
							  ' (urlMd5, urlName, status, updateStatusDate) VALUES';
				$insert_sql .= implode( ', ', $insert_place_holders );
				$wpdb->query( $wpdb->prepare( "$insert_sql ", $values ) ); // phpcs:ignore


				//# selecting the urls found in page
				$select_sql = "SELECT urlMd5, urlMetaDescription, urlTitle, urlName FROM $screenshot_table
								WHERE status = 'A' AND urlMd5 IN ($select_placeholders)";
				$result = $wpdb->query( $wpdb->prepare( "$select_sql ",  $select_url_md5_array) ); // phpcs:ignore

				foreach ( $result as $row ) {
					$elements_to_enhance[ $row['urlMd5'] ]->setAttribute(
						'title',
						urlslab_get_url_description( $row['urlMetaDescription'], $row['urlTitle'], $row['urlName'] ),
					);
				}
			}

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . str_replace( '>', ' ', $e->getMessage() ) . "\n--->";
		}
	}
}
