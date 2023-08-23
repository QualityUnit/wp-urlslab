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
	const SETTING_NAME_FIX_PROTOCOL = 'urlslab_fix_protocol';
	const SETTING_NAME_ADD_HREFLANG = 'urlslab_add_hreflang';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'post_updated', $this, 'post_updated', 10, 3 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 12 );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID );
	}

	public function post_updated( $post_id, $post, $post_before ) {
		$url_obj = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( new Urlslab_Url( get_permalink( $post_id ) ) );
		if ( $url_obj ) {
			if ( $post->post_title != $post_before->post_title ) {
				$url_obj->set_url_title( $post->post_title );
			}
			$desc = get_post_meta( $post_id );
			if ( isset( $desc['_yoast_wpseo_metadesc'][0] ) ) {
				$url_obj->set_url_meta_description( $desc['_yoast_wpseo_metadesc'][0] );
			}

			if ( $post->post_status !== $post_before->post_status ) {
				if ( 'publish' === $post->post_status ) {
					$url_obj->set_http_status( Urlslab_Url_Row::HTTP_STATUS_OK );
				} else {
					$url_obj->set_http_status( Urlslab_Url_Row::HTTP_STATUS_CLIENT_ERROR );
				}
			}

			//request update of screenshot
			if ( Urlslab_Url_Row::SCR_STATUS_ACTIVE === $url_obj->get_scr_status() ) {
				$url_obj->set_scr_status( Urlslab_Url_Row::SCR_STATUS_NEW );
			}
			if ( Urlslab_Url_Row::SUM_STATUS_ACTIVE === $url_obj->get_sum_status() ) {
				$url_obj->set_sum_status( Urlslab_Url_Row::SUM_STATUS_NEW );
			}

			$url_obj->update();
		}
	}

	public function get_widget_slug(): string {
		return Urlslab_Link_Enhancer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'URL Monitoring' );
	}

	public function get_widget_description(): string {
		return __( 'Monitor and maintain all internal and external links on your website' );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_admin() || is_404() ) {
			return;
		}
		$this->validateCurrentPageUrl();
		$this->addIdToHTags( $document );
		$this->fixProtocol( $document );
		$this->fixPageIdLinks( $document );
		$this->processTitleAttribute( $document );
		$this->processLinkFragments( $document );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	public function validateCurrentPageUrl(): void {
		$currentUrl = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( Urlslab_Url::get_current_page_url() );
		if ( null !== $currentUrl ) {
			if ( Urlslab_Url_Row::URL_TYPE_EXTERNAL == $currentUrl->get_url_type() ) {
				$currentUrl->set_url_type( Urlslab_Url_Row::URL_TYPE_INTERNAL );
			}

			if ( $this->get_option( self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL ) ) {
				if ( Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED == $currentUrl->get_http_status() ) {
					if ( is_404() ) {
						$currentUrl->set_http_status( 404 );
					} else {
						$currentUrl->set_http_status( Urlslab_Url_Row::HTTP_STATUS_OK );
					}
				}
			}

			$currentUrl->update();
		}
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Link Formatting and Monitoring' ), __( 'This plugin seamlessly monitor link usage on your website during page view. Utilizing advanced data or preset enhancements, all links in the created HTML are evaluated and optimized for top performance.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_URLS_MAP,
			true,
			true,
			__( 'Monitor Link Usage' ),
			__( 'It will automatically create and save a diagram illustrating the connections between your website\'s pages.' ),
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
			__( 'The text that appears in the link\'s title/alt text. If the summary is not present, the meta description of the target URL is utilized.' ),
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
			__( 'Improve Links Using Text Fragment' ),
			__( 'Insert Text fragments into your website\'s links to enhance internal SEO and direct visitors to the relevant paragraph connected with the link. To bypass some links, add the `urlslab-skip-fragment` class name to either the link or sections housing these links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);
		$this->add_option_definition(
			self::SETTING_NAME_ADD_HREFLANG,
			true,
			true,
			__( 'Improve Links with Hreflang Attribute' ),
			__( 'When the destination page of the link is analyzed and includes a lang attribute, improve each link with an hreflang attribute.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_option_definition(
			self::SETTING_NAME_ADD_ID_TO_ALL_H_TAGS,
			false,
			true,
			__( 'Insert Anchor IDs to Every Heading' ),
			__( 'Improve all headers with ID attributes to enable users to link directly to a specific part of the website.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'main'
		);

		$this->add_options_form_section( 'validation', __( 'Link Validation' ), __( 'Maintaining your content\'s quality is a crucial SEO duty. Use the settings below to automate the dead or broken link checks on your website. This eliminates the manual hunt for these invalid links in your HTML content.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_VALIDATE_LINKS,
			true,
			false,
			__( 'Validate Links' ),
			__( 'Verify the HTTP status of each link present in the website content.' ),
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
			__( 'Define the frequency for URL status checks on your site. This feature may require significant processing resources. For optimal performance, we suggest monthly or quarterly check.' ),
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
			self::SETTING_NAME_MARK_AS_VALID_CURRENT_URL,
			true,
			true,
			__( 'Mark URLs Processed by WordPress as Valid' ),
			__( 'When WordPress delivers an unvalidated URL, we\'ll deem it valid.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REMOVE_LINKS,
			true,
			true,
			__( 'Hide Links Marked as Hidden' ),
			__( 'Hide all links in HTML content that are manually marked as hidden.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_REPLACE_3XX_LINKS,
			true,
			true,
			__( 'Replace Redirected Links for Their Destination URLs' ),
			__( 'Substitute all links that have redirects with their destination URLs.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_PAGE_ID_LINKS_TO_SLUG,
			true,
			true,
			__( 'Replace Non-SEO Friendly Links' ),
			__( 'Substitute all non-SEO friendly links with their SEO friendly versions, which search engines prefer. Currently, our support is limited to replacing `page_id` links. To omit certain links, assign the `urlslab-skip-page_id` class name to the link or to any elements that encompass the links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_option_definition(
			self::SETTING_NAME_DELETE_LINK_IF_PAGE_ID_NOT_FOUND,
			true,
			true,
			__( 'Hide Invalid Non-SEO Friendly Links' ),
			__( 'Hide all links that have an incorrect `page_id` within the website content.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FIX_PROTOCOL,
			true,
			true,
			__( 'Unify Protocol' ),
			__( 'Ensure all links have the same protocol as the current domain.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'validation'
		);

		$this->add_options_form_section( 'scheduling', __( 'Schedule Configuration' ), __( 'Boost your page\'s content quality using AI-powered summarizations by URLsLab service for all your site\'s URLs. Enhance link titles and meta descriptions, giving visitors a clear preview of the content they\'ll find on the destination page.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_AUTMATICALLY_GENERATE_SUMMARY_INTERNAL_LINKS,
			false,
			true,
			__( 'Schedule All Internal Links' ),
			__( 'When a fresh internal link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.' ),
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
			__( 'When a fresh external link is identified, it gets automatically scheduled for AI-automated summarization via URLsLab service, thus enhancing both link headings and meta description tags. The inclusion of these summaries on your website could take a few days, as the time frame depends on the load of data in process.' ),
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
		$link_data = $xpath->query( "//a[contains(@href, '?page_id=') and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-page_id')]) and not(ancestor::*[@id='wpadminbar'])]" );

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

		$srcUrlId = Urlslab_Url::get_current_page_url()->get_url_id();

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
			$elements = $xpath->query( "//a[not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-title')]) and not(ancestor::*[@id='wpadminbar'])]" );

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
						array( Urlslab_Url::get_current_page_url() ),
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
									$new_title = $result[ $url_obj->get_url_id() ]->get_summary_text( $strategy );
									if ( strlen( $new_title ) ) {
										$dom_elem->setAttribute( 'title', $new_title );
									}
								}

								//add hreflang attribute
								if ( empty( $dom_elem->getAttribute( 'hreflang' ) ) && $this->get_option( self::SETTING_NAME_ADD_HREFLANG ) && ! empty( $result[ $url_obj->get_url_id() ]->get_url_lang() ) && Urlslab_Url_Row::VALUE_EMPTY !== $result[ $url_obj->get_url_id() ]->get_url_lang() ) {
									$dom_elem->setAttribute( 'hreflang', $result[ $url_obj->get_url_id() ]->get_url_lang() );
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
			$headers  = $xpath->query( "//*[substring-after(name(), 'h') > 0 and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-keywords')]) and not(ancestor::*[@id='wpadminbar'])]" );
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
		$elements = $xpath->query( "//a[@href and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-fragment')]) and not(ancestor::*[@id='wpadminbar'])]" );
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

	private function fixProtocol( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_FIX_PROTOCOL ) ) {
			return;
		}
		$xpath    = new DOMXPath( $document );
		$elements = $xpath->query( "//a[@href and not(ancestor-or-self::*[contains(@class, 'urlslab-skip-all') or contains(@class, 'urlslab-skip-protocol-fix')])]" );

		$current_page = Urlslab_Url::get_current_page_url();

		foreach ( $elements as $dom_elem ) {
			if ( strlen( $dom_elem->getAttribute( 'href' ) ) && str_starts_with( $dom_elem->getAttribute( 'href' ), 'http' ) ) {
				try {
					$url = new Urlslab_Url( $dom_elem->getAttribute( 'href' ) );
					if ( $url->is_url_valid() && $url->is_same_domain_url() && $current_page->get_protocol() !== $url->get_protocol() ) {
						$dom_elem->setAttribute( 'href', Urlslab_Url::add_current_page_protocol( $url->get_url() ) );
					}
				} catch ( Exception $e ) {
					// noop, just skip link
				}
			}
		}
	}
}


function urlslab_url_attribute( $attribute_name, $url = false ) {
	try {
		if ( $url ) {
			$url_obj = new Urlslab_Url( $url, true );
		} else {
			$url_obj = Urlslab_Url::get_current_page_url();
		}
		$url_row = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $url_obj );

		if ( $url_row ) {
			return $url_row->get_public( $attribute_name );
		}
	} catch ( Exception $e ) {
	}

	return '';
}

function urlslab_url_attributes( $url = false ): array {
	try {
		if ( $url ) {
			$url_obj = new Urlslab_Url( $url, true );
		} else {
			$url_obj = Urlslab_Url::get_current_page_url();
		}
		$url_row = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $url_obj );

		if ( $url_row ) {
			return $url_row->as_array();
		}
	} catch ( Exception $e ) {
		return array();
	}
}
