<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	const SLUG = 'urlslab-link-enhancer';
	public const DESC_TEXT_SUMMARY = 'S';
	public const DESC_TEXT_URL = 'U';
	public const DESC_TEXT_TITLE = 'T';
	public const DESC_TEXT_META_DESCRIPTION = 'M';


	public const SETTING_NAME_DESC_REPLACEMENT_STRATEGY = 'urlslab_desc_replacement_strategy';
	const SETTING_NAME_REMOVE_LINKS = 'urlslab_remove_links';
	const SETTING_NAME_VALIDATE_LINKS = 'urlslab_validate_links';
	const SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL = 'urlslab_url_http_status_interval';
	const SETTING_NAME_URLS_MAP = 'urlslab_urls_map';
	const SETTING_NAME_ADD_LINK_FRAGMENT = 'urlslab_add_lnk_fragment';


	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'theContentHook', 12 );
	}

	public function post_updated( $post_id, $post, $post_before ) {
		$data = array();
		if ( $post->post_title != $post_before->post_title ) {
			$data['url_title'] = $post->post_title;
		}
		$desc = get_post_meta( $post_id );
		if ( isset( $desc['_yoast_wpseo_metadesc'][0] ) ) {
			$data['url_meta_description'] = $desc['_yoast_wpseo_metadesc'][0];
		}

		if ( ! empty( $data ) ) {
			try {
				$url = new Urlslab_Url( get_permalink( $post_id ) );
				global $wpdb;
				$wpdb->update( URLSLAB_URLS_TABLE, $data, array( 'url_id' => $url->get_url_id() ) );
			} catch ( Exception $e ) {
			}
		}
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Link_Enhancer::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Links Manager' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( 'Monitor and maintain all internal and external links on your website' );
	}


	public function theContentHook( DOMDocument $document ) {
		$this->processTitleAttribute( $document );
		$this->processLinkFragments( $document );
	}

	private function update_urls_map( array $url_ids ) {
		if ( ! $this->get_option( self::SETTING_NAME_URLS_MAP ) ) {
			return;
		}

		$srcUrlId = $this->get_current_page_url()->get_url_id();

		global $wpdb;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT dest_url_id FROM ' . URLSLAB_URLS_MAP_TABLE . ' WHERE src_url_id = %d', // phpcs:ignore
				$srcUrlId
			),
			'ARRAY_A'
		);

		$destinations = array();
		array_walk(
			$results,
			function( $value, $key ) use ( &$destinations ) {
				$destinations[ $value['dest_url_id'] ] = true;
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
			$insert_update_query = "INSERT IGNORE INTO $table (src_url_id, dest_url_id) VALUES $placeholder_string";

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
			$delete_query       = "DELETE FROM $table WHERE src_url_id=%d AND dest_url_id IN ($placeholder_string)";
			$wpdb->query( $wpdb->prepare( $delete_query, $values ) ); // phpcs:ignore
		}
	}

	public function is_api_key_required() {
		return true;
	}

	/**
	 * @param DOMDocument $document
	 *
	 * @return void
	 */
	private function processTitleAttribute( DOMDocument $document ): void {
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

				$result = Urlslab_Url_Data_Fetcher::get_instance()->fetch_schedule_urls_batch(
					array_merge(
						array( $this->get_current_page_url() ),
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
									if ( $dom_elem->childNodes->length > 0 ) {
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
										$result[ $url_obj->get_url_id() ]->get_summary_text( $strategy ),
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

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Link Format and Monitoring' ), __( 'Plugin automatically tracks usage of html links on your website as the page is displayed. Every link in the generated HTML is evaluated and improved if we have additional data about destination URL of the link.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
			self::DESC_TEXT_SUMMARY,
			true,
			__( 'Link Description' ),
			__( 'What text is used in the link\'s title/alt text. There is a fallback tree, so if the summary is missing, the meta description of destination url is used.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY          => __( 'Summary of destination URL' ),
				Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION => __( 'Meta description of destination URL' ),
				Urlslab_Link_Enhancer::DESC_TEXT_TITLE            => __( 'Title of destination URL' ),
				Urlslab_Link_Enhancer::DESC_TEXT_URL              => __( 'URL path converted to title' ),
			),
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			__( 'Track links usage' ),
			__( 'The plugin will automatically store a graph of the relationships between the pages on your website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_LINK_FRAGMENT,
			true,
			true,
			__( 'Enhance Links with Text Fragment' ),
			__( 'Add Text fragments to the links on the website. It will help with internal SEO, and it will scroll visitors to the exact paragraph which is related to the link. If you want to skip only some links, add the `urlslab-skip-fragment` class name to the link or sections with links. Example: <code><a>https://www.liveagent.com/pricing#:~:text=Enterprise</a></code>' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);


		$this->add_options_form_section( 'validation', __( 'Link Validation' ), __( 'One of the important SEO tasks is to keep high quality of your content. Your website should not contain links leading to invalid or not existing pages. Following settings can help you to automate the process in large scale. You will not need to search for invalid links in your HTML content manually.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			false,
			false,
			__( 'Validate Found Links' ),
			__( 'Check HTTP status of every link which has been found in the website content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			__( 'Hide Invalid Links' ),
			__( 'Hide all invalid links from the content which lead to a 404 or 503 error page.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL,
			2419200,
			false,
			__( 'Validation Interval' ),
			__( 'Define how often should check your wordpress plugin status of urls used in your website. Even we check status of urls on the background by cron task, it can use a lot of computation time. We recommend Monthly or Quarterly updates. To keep up to date status of each url we can hide links invalid links from your website automatically.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400     => __( 'Daily' ),
				604800    => __( 'Weekly' ),
				2419200   => __( 'Monthly' ),
				7257600   => __( 'Quarterly' ),
				31536000  => __( 'Yearly' ),
				999999999 => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'validation',
		);


	}

	private function processLinkFragments( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_ADD_LINK_FRAGMENT ) ) {
			return;
		}
		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( "//a[@href and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-fragment')])]" );
		foreach ( $elements as $dom_elem ) {
			if ( strlen( $dom_elem->getAttribute( 'href' ) ) && false === strpos( $dom_elem->getAttribute( 'href' ), '#' ) ) {
				$fragment_text = '';
				if ( $dom_elem->childNodes->length > 0 && property_exists( $dom_elem->childNodes->item( 0 ), 'wholeText' ) ) {
					$fragment_text = trim( $dom_elem->childNodes->item( 0 )->wholeText );
				} else if ( property_exists( $dom_elem, 'domValue' ) ) {
					$fragment_text = trim( $dom_elem->domValue );
				}
				if ( strlen( $fragment_text ) ) {
					try {
						$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
						if ( $url->is_url_valid() && $url->is_same_domain_url() ) {
							$dom_elem->setAttribute( 'href', $dom_elem->getAttribute( 'href' ) . '#:~:text=' . urlencode( $fragment_text ) );
						}
					} catch ( Exception $e ) {
						//noop, just skip link
					}
				}
			}
		}
	}
}
