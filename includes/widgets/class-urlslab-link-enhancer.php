<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Link_Enhancer extends Urlslab_Widget {
	public const SLUG = 'urlslab-link-enhancer';
	public const DESC_TEXT_SUMMARY = 'S';
	public const DESC_TEXT_URL = 'U';
	public const DESC_TEXT_TITLE = 'T';
	public const DESC_TEXT_META_DESCRIPTION = 'M';

	public const SETTING_NAME_DESC_REPLACEMENT_STRATEGY = 'urlslab_desc_replacement_strategy';
	public const SETTING_NAME_REMOVE_LINKS = 'urlslab_remove_links';
	public const SETTING_NAME_VALIDATE_LINKS = 'urlslab_validate_links';
	public const SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL = 'urlslab_url_http_status_interval';
	public const SETTING_NAME_URLS_MAP = 'urlslab_urls_map';
	public const SETTING_NAME_ADD_LINK_FRAGMENT = 'urlslab_add_lnk_fragment';

	public const SETTING_NAME_ADD_ID_TO_ALL_H_TAGS = 'urlslab_H_add_id';
	public const SETTING_NAME_PAGE_ID_LINKS_TO_SLUG = 'urlslab_pid_to_slug';
	public const SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND = 'urlslab_pid_del_notfound';
	public const SETTING_NAME_MARK_AS_VALID_CURRENT_URL = 'urlslab_mark_as_valid_current_url';
	public const SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS = 'urlslab_auto_sum_int_links';
	public const SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS = 'urlslab_auto_sum_ext_links';
	const SETTING_NAME_REPLACE_3XX_LINKS = 'urlslab_replace_3xx_links';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_content', $this, 'theContentHook', 12 );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID );
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

	public function get_widget_slug(): string {
		return Urlslab_Link_Enhancer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Links Manager' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor and maintain all internal and external links on your website' );
	}

	public function theContentHook( DOMDocument $document ) {
		$this->validateCurrentPageUrl();
		$this->addIdToHTags( $document );
		$this->fixPageIdLinks( $document );
		$this->processTitleAttribute( $document );
		$this->processLinkFragments( $document );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	public function validateCurrentPageUrl(): void {
		$currentUrl = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $this->get_current_page_url() );
		if ( null !== $currentUrl ) {
			if ( Urlslab_Url_Row::URL_TYPE_EXTERNAL == $currentUrl->get_url_type() ) {
				$currentUrl->set_url_type( Urlslab_Url_Row::URL_TYPE_INTERNAL );
			}

			if ( $this->get_option( self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL ) ) {
				if ( Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED == $currentUrl->get_http_status() ) {
					$currentUrl->set_http_status( Urlslab_Url_Row::HTTP_STATUS_OK );
				}
			}

			$currentUrl->update();
		}
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Link Format and Monitoring' ), __( 'This plugin automatically tracks the usage of links on your website as the page is displayed. With additional data or if you set up the improvements, every link in the generated HTML will be evaluated and improved for optimal results.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			__( 'Track Links Usage' ),
			__( 'The plugin will automatically generate and store a graph of the relationships between the pages on your website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DESC_REPLACEMENT_STRATEGY,
			self::DESC_TEXT_SUMMARY,
			true,
			__( 'Link Description' ),
			__( 'What text is used in the link\'s title/alt text. There is a fallback tree, so if the summary is missing, the meta description of the destination URL is used.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY          => __( 'Use summaries' ),
				Urlslab_Link_Enhancer::DESC_TEXT_META_DESCRIPTION => __( 'Use meta description' ),
				Urlslab_Link_Enhancer::DESC_TEXT_TITLE            => __( 'Use URL title' ),
				Urlslab_Link_Enhancer::DESC_TEXT_URL              => __( 'Use URL path' ),
			),
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_LINK_FRAGMENT,
			true,
			true,
			__( 'Enhance Links with Text Fragment' ),
			__( 'Add Text fragments to the links on the website. It will help with internal SEO, and it will scroll visitors to the exact paragraph which is related to the link. If you want to skip certain links, add the `urlslab-skip-fragment` class name to the link or sections with links. Example: <code>https://www.urlslab.com/pricing#:~:text=Plans</code>' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS,
			false,
			true,
			__( 'Add Anchor ID to All Headings' ),
			__( 'Enhance all headings with ID attributes to allow visitors to link directly to the exact section of the website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section( 'validation', __( 'Link Validation' ), __( 'One of the essential SEO tasks is to maintain a high level of quality for your content. To ensure that your website doesn\'t contain any broken or dead links, you can use the following settings to automate the process on a large scale. It will eliminate the need to manually search for invalid links in your HTML content.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			true,
			false,
			__( 'Validate Found Links' ),
			__( 'Check the HTTP status of every link found in the website\'s content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL,
			true,
			true,
			__( 'Mark as valid URL processed by WP' ),
			__( 'If we find any URL, which is not validated yet, but Wordpress just served this url, we will mark it as valid. This will speed up the process of HTTP status validation, but doesn\' guarantee, that HTTP status is OK. Response could fail on the other stage of your infrastructure.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			__( 'Hide Links marked as hidden' ),
			__( 'Hide all links in HTML content marked manually by administrator in Link Managers as hidden' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REPLACE_3XX_LINKS,
			false,
			true,
			__( 'Replace 3XX Links with destination url' ),
			__( 'In case content contains link to any URL with 3XX redirect, replace this link with URL evaluated as destination URL' ),
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
			__( 'Define how often we should check the status of URLs used in your website. The functionality can use a lot of computation time. To ensure optimal performance, we recommend performing monthly or quarterly updates.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				86400            => __( 'Daily' ),
				604800           => __( 'Weekly' ),
				2419200          => __( 'Monthly' ),
				7257600          => __( 'Quarterly' ),
				31536000         => __( 'Yearly' ),
				self::FREQ_NEVER => __( 'Never' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 < $value;
			},
			'validation',
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG,
			true,
			true,
			__( 'Replace non-SEO Friendly Links' ),
			__( 'Replace all non-SEO friendly links with their optimized version, which search engines prefer. We currently only support replacing `page_id` links. If you wish to ignore certain links, add the `urlslab-skip-page_id` class name to the link or any elements containing the links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND,
			true,
			true,
			__( 'Hide Invalid non-SEO Friendly Links' ),
			__( /* @lang text */ "Hide all links with an invalid `page_id` in the website's content." ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_options_form_section( 'scheduling', __( 'Scheduling Settings' ), __( 'Boost your page\'s content quality with AI-powered summarizations by URLsLab service for all URLs on your site. Enhance link titles and meta descriptions, providing visitors a clear preview of the information awaiting them on the destination page.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS,
			true,
			true,
			__( 'Schedule All Internal Links' ),
			__( 'When a new internal link is detected, it\'s automatically scheduled for AI-powered summarization by URLsLab service, enriching both link titles and meta description tags. Integrating summaries into your website may take a few days, as the duration depends on the volume of data being processed.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS,
			false,
			true,
			__( 'Schedule All External Links' ),
			__( 'When a new external link is detected, it\'s automatically scheduled for AI-powered summarization by URLsLab service, enriching link titles. Integrating summaries into your website may take a few days, as the duration depends on the volume of data being processed.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'scheduling'
		);
	}

	private function fixPageIdLinks( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG ) ) {
			return;
		}

		$xpath     = new DOMXPath( $document );
		$link_data = $xpath->query( "//a[contains(@href, '?page_id=') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-page_id')])]" );

		foreach ( $link_data as $link_element ) {
			try {
				$url = new Urlslab_Url( $link_element->getAttribute( 'href' ) );
				if ( preg_match( '/page_id=(\d*)/i', $url->get_url_query(), $mathes ) ) {
					if ( isset( $mathes[1] ) && is_numeric( $mathes[1] ) ) {
						$post_permalink = get_the_permalink( $mathes[1] );
						if ( $post_permalink ) {
							$link_element->setAttribute( 'href', $post_permalink );
							if ( $link_element->hasAttribute( 'target' ) && '_blank' == $link_element->getAttribute( 'target' ) ) {
								try {
									$permalink_url = new Urlslab_Url( $post_permalink );
									if ( $permalink_url->is_same_domain_url() ) {
										$link_element->removeAttribute( 'target' );
									}
								} catch ( Exception $e ) {
								}
							}
						} else {
							if ( $this->get_option( self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND ) ) {
								// link should not be visible, remove it from content
								if ( $link_element->childNodes->length > 0 ) {
									$fragment = $document->createDocumentFragment();
									if ( $link_element->childNodes->length > 0 ) {
										$fragment->appendChild( $link_element->childNodes->item( 0 ) );
									}
									$link_element->parentNode->replaceChild( $fragment, $link_element );
								} else {
									if ( property_exists( $link_element, 'domValue' ) ) {
										$txt_value = $link_element->domValue;
									} else {
										$txt_value = '';
									}
									$txt_element = $document->createTextNode( $txt_value );
									$link_element->parentNode->replaceChild( $txt_element, $link_element );
								}
							}
						}
					}
				}
			} catch ( Exception $e ) {
			}
		}
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
			$insert_update_query = "INSERT IGNORE INTO {$table} (src_url_id, dest_url_id) VALUES {$placeholder_string}";

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
			$delete_query       = "DELETE FROM {$table} WHERE src_url_id=%d AND dest_url_id IN ({$placeholder_string})";
			$wpdb->query( $wpdb->prepare( $delete_query, $values ) ); // phpcs:ignore
		}
	}

	private function processTitleAttribute( DOMDocument $document ): void {
		try {
			$xpath    = new DOMXPath( $document );
			$elements = $xpath->query( "//a[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-title')])]" );

			$link_elements = array();
			if ( $elements instanceof DOMNodeList ) {
				foreach ( $elements as $dom_element ) {
					// skip processing if A tag contains attribute "urlslab-skip-all" or urlslab-skip-title
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
				$result = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_urls(
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
						if ( isset( $result[ $url_obj->get_url_id() ] ) && ! empty( $result[ $url_obj->get_url_id() ] ) ) {
							if ( $this->get_option( self::SETTING_NAME_REMOVE_LINKS ) && ! $result[ $url_obj->get_url_id() ]->is_visible() ) {
								// link should not be visible, remove it from content
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
							} else if ( $result[ $url_obj->get_url_id() ]->is_http_redirect() && $this->get_option( self::SETTING_NAME_REPLACE_3XX_LINKS ) ) {
								if ( isset( $result[ $result[ $url_obj->get_url_id() ]->get_final_url_id() ] ) ) {
									$dom_elem->setAttribute( 'urlslab_href_old', $dom_elem->getAttribute( 'href' ) );
									$dom_elem->setAttribute( 'href', $result[ $result[ $url_obj->get_url_id() ]->get_final_url_id() ]->get_url()->get_url_with_protocol() );
								} else {
									$new_url = new Urlslab_Url_Row( array( 'url_id' => $result[ $url_obj->get_url_id() ]->get_final_url_id() ) );
									if ( $new_url->load() ) {
										$dom_elem->setAttribute( 'urlslab_href_old', $dom_elem->getAttribute( 'href' ) );
										$dom_elem->setAttribute( 'href', $new_url->get_url()->get_url_with_protocol() );
									}
								}
							} else {
								// enhance title if url has no title
								if ( empty( $dom_elem->getAttribute( 'title' ) ) ) {
									if (
										empty( $result[ $url_obj->get_url_id() ]->get_sum_status() ) &&
										(
											$result[ $url_obj->get_url_id() ]->is_internal() && $this->get_option( self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS )
											|| ! $result[ $url_obj->get_url_id() ]->is_internal() && $this->get_option( self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_EXTERNAL_LINKS )
										)
									) {
										$result[ $url_obj->get_url_id() ]->set_sum_status( Urlslab_Url_Row::SUM_STATUS_NEW );
										$result[ $url_obj->get_url_id() ]->update();
									}

									$new_title = $result[ $url_obj->get_url_id() ]->get_summary_text( $strategy );
									if ( strlen( $new_title ) ) {
										$dom_elem->setAttribute( 'title', $new_title );
									}
								}
							}
						}
					}
				}
			}
		} catch ( Exception $e ) {
		}
	}

	private function addIdToHTags( DOMDocument $document ) {
		if ( $this->get_option( self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS ) ) {
			$used_ids = array();
			$xpath    = new DOMXPath( $document );
			$headers  = $xpath->query( "//*[substring-after(name(), 'h') > 0 and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-keywords')])]" );
			foreach ( $headers as $header_element ) {
				if ( ! $header_element->hasAttribute( 'id' ) ) {
					$id = strtolower( trim( $header_element->nodeValue ) );
					$id = 'h-' . trim( preg_replace( '/[^\w]+/', '-', $id ), '-' );
					if ( ! isset( $used_ids[ $id ] ) ) {
						$header_element->setAttribute( 'id', $id );
					}
				}
				$used_ids[ $header_element->getAttribute( 'id' ) ] = 1;
			}
		}
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
				} else {
					if ( property_exists( $dom_elem, 'domValue' ) ) {
						$fragment_text = trim( $dom_elem->domValue );
					}
				}
				if ( strlen( $fragment_text ) ) {
					try {
						$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
						if ( $url->is_url_valid() && $url->is_same_domain_url() ) {
							$dom_elem->setAttribute( 'href', $dom_elem->getAttribute( 'href' ) . '#:~:text=' . urlencode( $fragment_text ) );
						}
					} catch ( Exception $e ) {
						// noop, just skip link
					}
				}
			}
		}
	}
}
