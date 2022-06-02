<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/widgets/class-urlslab-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-user-widget.php';
require_once URLSLAB_PLUGIN_DIR . '/includes/class-urlslab-url.php';

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	private string $widget_slug;

	private string $widget_title;

	private string $widget_description;

	private string $landing_page_link;

	const MAX_URLS_TO_ENHANCE = 100;


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
		$document->strictErrorChecking = false; // phpcs:ignore
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
						$url = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
						$elements_to_enhance[] = array( $dom_element, $url->get_url(), $url->get_url_id() );
					}
				}
			}


			if ( ! empty( $elements_to_enhance ) ) {

				$values = array();
				$insert_place_holders = array();
				$select_url_md5_array = array();
				$update_time = time();
				foreach ( $elements_to_enhance as $arr_element ) {
					if ( ! isset( $insert_place_holders[ $arr_element[2] ] ) ) {
						array_push( $values, $arr_element[2], $arr_element[1], Urlslab::$link_status_not_scheduled, $update_time );
						$insert_place_holders[ $arr_element[2] ] = '(%s, %s, %s, %s)';
						$select_url_md5_array[ $arr_element[2] ] = $arr_element[2];
					}

					if ( count( $select_url_md5_array ) > self::MAX_URLS_TO_ENHANCE ) {
						break;
					}
				}

				global $wpdb;
				$urls_table = $wpdb->prefix . 'urlslab_url';
				$insert_sql = 'INSERT IGNORE INTO ' . $urls_table .
							  ' (urlMd5, urlName, status, updateStatusDate) VALUES';
				$insert_sql .= implode( ', ', $insert_place_holders );
				$wpdb->query( $wpdb->prepare( "$insert_sql ", $values ) ); // phpcs:ignore


				//# selecting the urls found in page
				$select_placeholders = implode( ', ', array_fill( 0, count( $select_url_md5_array ), '%s' ) );
				$select_sql = "SELECT urlMd5, urlMetaDescription, urlTitle, urlName FROM $urls_table
								WHERE status = 'A' AND urlMd5 IN ($select_placeholders)";
				$result = $wpdb->get_results( $wpdb->prepare( "$select_sql",  $select_url_md5_array), OBJECT_K); // phpcs:ignore

				if ( ! empty( $result ) ) {
					foreach ( $elements_to_enhance as $arr_element ) {
						if ( isset( $result[ $arr_element[2] ] ) ) {
							( $arr_element[0] )->setAttribute(
								'title',
								urlslab_get_url_description( $result[ $arr_element[2] ]->urlMetaDescription, $result[ $arr_element[2] ]->urlTitle, $result[ $arr_element[2] ]->urlName ),
							);
						}
					}
				}
			}

			return $document->saveHTML();
		} catch ( Exception $e ) {
			return $content . "\n" . "<!---\n Error:" . str_replace( '>', ' ', $e->getMessage() ) . "\n--->";
		}
	}
}
