<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Link_Enhancer extends Urlslab_Widget {

	public const DESC_TEXT_SUMMARY = 'S';
	public const DESC_TEXT_URL = 'U';
	public const DESC_TEXT_TITLE = 'T';
	public const DESC_TEXT_META_DESCRIPTION = 'M';
	private string $widget_slug;
	private string $widget_title;
	private string $widget_description;
	private string $landing_page_link;
	private Urlslab_Admin_Page $parent_page;
	private Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher;

	public const SETTING_NAME_DESC_REPLACEMENT_STRATEGY = 'urlslab_desc_replacement_strategy';
	const SETTING_NAME_REMOVE_LINKS = 'urlslab_remove_links';
	const SETTING_NAME_VALIDATE_LINKS = 'urlslab_validate_links';
	const SETTING_NAME_LAST_LINK_VALIDATION_START = 'urlslab_last_validation';
	const SETTING_NAME_URLS_MAP = 'urlslab_urls_map';

	/**
	 * @param Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher
	 */
	public function __construct( Urlslab_Url_Data_Fetcher $urlslab_url_data_fetcher ) {
		$this->urlslab_url_data_fetcher = $urlslab_url_data_fetcher;
		$this->widget_slug              = 'urlslab-link-enhancer';
		$this->widget_title             = 'Link Management';
		$this->widget_description       = 'Enhance all external and internal links in your pages using link enhancer widget. add title to your link automatically';
		$this->landing_page_link        = 'https://www.urlslab.com';
		$this->parent_page              = Urlslab_Page_Factory::get_instance()->get_page( 'urlslab-link-building' );
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'theContentHook', 12 );
	}

	public function post_updated( $post_id, $post, $post_before ) {
		$data = array();
		if ( $post->post_title != $post_before->post_title ) {
			$data['urlTitle'] = $post->post_title;
		}
		$desc = get_post_meta( $post_id );
		if ( isset( $desc['_yoast_wpseo_metadesc'][0] ) ) {
			$data['urlMetaDescription'] = $desc['_yoast_wpseo_metadesc'][0];
		}

		if ( ! empty( $data ) ) {
			try {
				$url = new Urlslab_Url( get_permalink( $post_id ) );
				global $wpdb;
				$wpdb->update( URLSLAB_URLS_TABLE, $data, array( 'urlMd5' => $url->get_url_id() ) );
			} catch ( Exception $e ) {
			}
		}
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

	public function theContentHook( DOMDocument $document ) {
		try {
			$xpath    = new DOMXPath( $document );
			$elements = $xpath->query( "//a[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-title')])]" );

			$link_elements = array();
			if ( $elements instanceof DOMNodeList ) {
				foreach ( $elements as $dom_element ) {
					//skip processing if A tag contains attribute "urlslab-skip-all" or urlslab-skip-title
					if ( $this->is_skip_elemenet( $dom_element, 'title' ) ) {
						continue;
					}

					if ( ! empty( trim( $dom_element->getAttribute( 'href' ) ) ) ) {
						try {
							$url             = new Urlslab_Url( $dom_element->getAttribute( 'href' ) );
							$link_elements[] = array( $dom_element, $url );
						} catch ( Exception $e ) {
						}
					}
				}
			}

			if ( ! empty( $link_elements ) ) {

				$result = $this->urlslab_url_data_fetcher->fetch_schedule_urls_batch(
					array_merge(
						array( new Urlslab_Url( urlslab_add_current_page_protocol( $this->get_current_page_url()->get_url() ) ) ),
						array_map( fn( $elem ): Urlslab_Url => $elem[1], $link_elements )
					)
				);

				if ( ! empty( $result ) ) {
					$strategy = $this->get_option( self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY );

					$this->update_urls_map( array_keys( $result ) );

					foreach ( $link_elements as $arr_element ) {
						list( $dom_elem, $url_obj ) = $arr_element;
						if (
							isset( $result[ $url_obj->get_url_id() ] ) &&
							! empty( $result[ $url_obj->get_url_id() ] )
						) {

							if (
								$this->get_option( self::SETTING_NAME_REMOVE_LINKS ) &&
								! $result[ $url_obj->get_url_id() ]->is_visible()
							) {
								//link should not be visible, remove it from content
								if ( $dom_elem->childNodes->length > 0 ) {
									$fragment = $document->createDocumentFragment();
									while ( $dom_elem->childNodes->length > 0 ) {
										$fragment->appendChild( $dom_elem->childNodes->item( 0 ) );
									}
									$dom_elem->parentNode->replaceChild( $fragment, $dom_elem );
								} else {
									if ( property_exists( $dom_element, 'domValue' ) ) {
										$txt_value = $dom_elem->domValue;
									} else {
										$txt_value = '';
									}
									$txt_element = $document->createTextNode( $txt_value );
									$dom_elem->parentNode->replaceChild( $txt_element, $dom_elem );
								}
							} else {
								//enhance title if url has no title
								if ( empty( $dom_elem->getAttribute( 'title' ) ) ) {
									$dom_elem->setAttribute(
										'title',
										$result[ $url_obj->get_url_id() ]->get_url_summary_text( $strategy ),
									);
								}
							}
						}
					}
				}
			}
		} catch ( Exception $e ) {
		}
	}

	public function get_shortcode_content( $atts = array(), $content = null, $tag = '' ): string {
		return '';
	}

	public function has_shortcode(): bool {
		return false;
	}

	public function visibility_active_in_table(): bool {
		return Urlslab_User_Widget::get_instance()->is_widget_activated( $this->widget_slug ) && $this->get_option( self::SETTING_NAME_REMOVE_LINKS );
	}

	public function render_widget_overview() {
		// TODO: Implement render_widget_overview() method.
	}

	public function get_thumbnail_demo_url(): string {
		return plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/demo/link-enhancer-demo.png' ) . 'link-enhancer-demo.png';
	}

	public function get_parent_page(): Urlslab_Admin_Page {
		return $this->parent_page;
	}

	public function get_widget_tab(): string {
		return 'link-management';
	}

	private function update_urls_map( array $url_ids ) {
		if ( ! $this->get_option( self::SETTING_NAME_URLS_MAP ) ) {
			return;
		}

		$srcUrlId = $this->get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT destUrlMd5 FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE srcUrlMd5 = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$destinations = array();
		array_walk(
			$results,
			function( $value, $key ) use ( &$destinations ) {
				$destinations[ $value['destUrlMd5'] ] = true;
			}
		);

		$tracked_urls = array();

		$values      = array();
		$placeholder = array();
		foreach ( $url_ids as $url_id ) {
			if ( ! isset( $destinations[ $url_id ] ) ) {
				array_push(
					$values,
					$srcUrlId,
					$url_id,
				);
				$placeholder[] = '(%d,%d)';
			} else {
				$tracked_urls[ $url_id ] = true;
			}
		}

		if ( ! empty( $values ) ) {
			$table               = URLSLAB_URLS_MAP_TABLE;
			$placeholder_string  = implode( ', ', $placeholder );
			$insert_update_query = "INSERT IGNORE INTO $table (srcUrlMd5, destUrlMd5) VALUES $placeholder_string";

			$wpdb->query(
				$wpdb->prepare(
					$insert_update_query, // phpcs:ignore
					$values
				)
			);
		}

		$delete = array_diff( array_keys( $destinations ), array_keys( $tracked_urls ) );
		if ( ! empty( $delete ) ) {
			$values      = array( $srcUrlId );
			$placeholder = array();
			foreach ( $delete as $url_id ) {
				$placeholder[] = '%d';
				$values[]      = $url_id;
			}
			$table              = URLSLAB_URLS_MAP_TABLE;
			$placeholder_string = implode( ',', $placeholder );
			$delete_query       = "DELETE FROM $table WHERE srcUrlMd5=%d AND destUrlMd5 IN ($placeholder_string)";
			$wpdb->query( $wpdb->prepare( $delete_query, $values ) ); // phpcs:ignore
		}
	}

	public function is_api_key_required() {
		return true;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
			self::DESC_TEXT_SUMMARY,
			true,
			__( 'Description value' ),
			__( 'Specify which data should be used to enhance your links automatically' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY          => __( 'Generate descriptions with summaries' ),
				Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION => __( 'Generate descriptions with meta description' ),
				Urlslab_Link_Enhancer::DESC_TEXT_TITLE            => __( 'Generate descriptions with Url title' ),
				Urlslab_Link_Enhancer::DESC_TEXT_URL              => __( 'Generate descriptions with Url path' ),
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			__( 'Hide Links' ),
			__( 'Hide links with status 404 or 503 or marked as invisible from all pages' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			__( 'Track Internal links' ),
			__( 'Store all links used in your website and analyze relations and content clusters between pages.' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			false,
			false,
			__( 'Validate Links' ),
			__( 'Make request to each URL found in website (in background by cron) and test if it is valid or invalid url (e.g. 404 page)' )
		);

		$this->add_option_definition(
			self::SETTING_NAME_LAST_LINK_VALIDATION_START,
			Urlslab_Data::get_now(),
			false,
			__( 'Validate urls created before' ),
			__( 'Background process validates all found URLs in page created after selected date.' ),
			self::OPTION_TYPE_DATETIME
		);
	}
}
