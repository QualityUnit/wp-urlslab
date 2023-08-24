<?php

// phpcs:disable WordPress

class Urlslab_Html_Optimizer extends Urlslab_Widget {
	public const SLUG = 'urlslab-css-optimizer';

	public const DOWNLOAD_CSS_URL_PATH = 'urlslab-css/';
	public const DOWNLOAD_JS_URL_PATH = 'urlslab-js/';

	public const SETTING_NAME_CSS_MAX_SIZE = 'urlslab_css_max_size';
	public const SETTING_NAME_CSS_CACHE_TTL = 'urlslab_css_ttl';
	const SETTING_NAME_HTML_MINIFICATION = 'urlslab_html_minification';
	const SETTING_NAME_CSS_MINIFICATION = 'urlslab_css_minification';
	const SETTING_NAME_JS_MINIFICATION = 'urlslab_js_minification';
	const SETTING_NAME_CSS_PROCESSING = 'urlslab_css_processing';
	const SETTING_NAME_JS_PROCESSING = 'urlslab_js_processing';
	const SETTING_NAME_CSS_MERGE = 'urlslab_css_merge';
	const CSS_CACHE_GROUP = 'css_cache';
	const SETTING_NAME_CSS_CACHE_VALID_FROM = 'urlslab_css_cache_valid_from';
	const SETTING_NAME_JS_CACHE_VALID_FROM = 'urlslab_js_cache_valid_from';
	const SETTING_NAME_JS_MAX_SIZE = 'urlslab_js_max_size';
	const SETTING_NAME_JS_CACHE_TTL = 'urlslab_js_ttl';
	const JS_CACHE_GROUP = 'js_cache';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS = 'urlslab_htmlmin_remove_comments';
	const SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES = 'urlslab_htmlmin_attributes';
	const SETTING_NAME_HTML_MINIFICATION_WHITESPACES = 'urlslab_htmlmin_whitespaces';
	const SETTING_NAME_HTML_MINIFICATION_DEPRECATED = 'urlslab_htmlmin_deprecated';
	const SETTING_NAME_HTML_MINIFICATION_SORT = 'urlslab_htmlmin_sort';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX = 'urlslab_htmlmin_remove_http_prefix';
	const SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED = 'urlslab_htmlmin_remove_omitted';

	public function __construct() {}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 1000 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'content_hook' );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_head_content_final', $this, 'minify_head_content', 0 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_body_content_final', $this, 'minify_body_content', 0 );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function get_widget_slug(): string {
		return Urlslab_Html_Optimizer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Output Optimizer' );
	}

	public function get_widget_description(): string {
		return __( 'Improve site speed and decrease requests from content-blockers by utilizing in-line Javascript and CSS rather than external documents and minification' );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_404() ) {
			return;
		}
		$this->css_processing( $document );
		$this->js_processing( $document );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'minify',
			__( 'HTML Minification' ),
			__( 'Compress HTML source by eliminating redundant whitespaces, comments, and other unnecessary characters without altering the content structure. This reduces page size and accelerates loading speed. Additionally, it optimizes HTML for improved gzip outcomes by alphabetically sorting attributes and CSS class names.' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION,
			true,
			true,
			__( 'HTML Minification' ),
			__( 'Enable HTML Minification.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES,
			true,
			true,
			__( 'Optimize Attributes' ),
			__( 'Delete attributes that have a default or empty value.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS,
			true,
			true,
			__( 'Remove Comments' ),
			__( 'Remove HTML comments. Often, comments are unused and merely create additional network traffic with every request.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES,
			true,
			true,
			__( 'Remove Whitespaces' ),
			__( 'Remove spaces in and around tags.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED,
			true,
			true,
			__( 'Remove Deprecated' ),
			__( 'Remove deprecated anchor names, script character set, and type from script tags. Also, remove type from stylesheet links.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED,
			true,
			true,
			__( 'Remove Omitted' ),
			__( 'Remove omitted quotes and HTML tags.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX,
			true,
			true,
			__( 'Remove Prefix From Attributes' ),
			__( 'Shorten links by eliminating protocols and adopting the relative protocol from the current page.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION_SORT,
			true,
			true,
			__( 'Sort Classes and Attributes' ),
			__( 'Improved GZIP compression can be achieved for strings if multiple tags use the same class name or attribute order.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);


		$this->add_options_form_section(
			'css',
			__( 'CSS Minification' ),
			__( 'Improving your website\'s speed is essential and can be accomplished by optimizing resources like CSS files. Configuring these files with a specific size limit and expiry date improves your website\'s performance and loading speed.' ),
			array(
				self::LABEL_FREE,
			)
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_PROCESSING,
			true,
			true,
			__( 'Process CSS files' ),
			__( 'Download CSS files, saves them to the database, and enhances for optimal performance.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CSS_CACHE_TTL,
			2592000,
			true,
			__( 'CSS Cache Expiration' ),
			__( 'Specify the duration for storing the CSS file in the database.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				3600     => __( 'One hour' ),
				28800    => __( 'Eight hours' ),
				86400    => __( 'One day' ),
				604800   => __( 'One week' ),
				2592000  => __( 'One moth' ),
				7776000  => __( 'Three months' ),
				15552000 => __( 'Six months' ),
				31536000 => __( 'One year' ),
				0        => __( 'No cache' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_CACHE_VALID_FROM,
			0,
			true,
			__( 'CSS Cache Valid From' ),
			__( 'CSS Cache valid from' ),
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MAX_SIZE,
			0,
			true,
			__( 'Convert Small CSS Files Into Inline HTML (bytes)' ),
			__( 'Set a size limit for the CSS file that loads into the HTML content. If you don\'t want any CSS file to be included in the main HTML, set this to 0.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MINIFICATION,
			true,
			true,
			__( 'CSS Minification' ),
			__( 'Minify CSS files by eliminating whitespace, deleting comments and refining/abbreviating some common coding patterns.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MERGE,
			false,
			true,
			__( 'Merge CSS' ),
			__( 'Merge all CSS files used on the page into a single file.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);


		$this->add_options_form_section(
			'js',
			__( 'Javascript Minification' ),
			__( 'Improving your website\'s speed is essential and can be accomplished by optimizing resources like JavaScript files. Configuring these files with a specific size limit and expiry date improves your website\'s performance and loading speed.' ),
			array(
				self::LABEL_FREE,
			)
		);

		$this->add_option_definition(
			self::SETTING_NAME_JS_PROCESSING,
			true,
			true,
			__( 'Javascript Processing' ),
			__( 'Download JavaScript files, saves them to the database, and enhances for optimal performance.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_CACHE_VALID_FROM,
			0,
			true,
			__( 'JavaScript Cache Valid From' ),
			__( 'JavaScript Cache Valid From' ),
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_CACHE_TTL,
			2592000,
			true,
			__( 'JavaScript Cache Expiration' ),
			__( 'Specify the duration for storing the JavaScript file in the database.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				3600     => __( 'One hour' ),
				28800    => __( 'Eight hours' ),
				86400    => __( 'One day' ),
				604800   => __( 'One week' ),
				2592000  => __( 'One moth' ),
				7776000  => __( 'Three months' ),
				15552000 => __( 'Six months' ),
				31536000 => __( 'One year' ),
				0        => __( 'No cache' ),
			),
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MAX_SIZE,
			0,
			true,
			__( 'Convert Small JavaScript Files Into Inline HTML (bytes)' ),
			__( 'Set a size limit for the JavaScript file that loads into the HTML content. If you don\'t want any JavaScript file to be included in the main HTML, set this to 0.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MINIFICATION,
			true,
			true,
			__( 'JavaScript Minification' ),
			__( 'Minify JavaScript files by eliminating whitespace, deleting comments and refining/abbreviating some common coding patterns.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js'
		);

	}

	private function insert_missing_css_files( array $links, array $css_files ) {
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();

		foreach ( $links as $url => $urld_id ) {
			if ( ! isset( $css_files[ $urld_id ] ) ) {
				$placeholders[] = '(%d,%s,%s,%s)';
				array_push(
					$values,
					$urld_id,
					$url,
					Urlslab_CSS_Cache_Row::STATUS_NEW,
					$now
				);
			}
		}
		if ( ! empty( $values ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_CSS_CACHE_TABLE . ' (url_id,url,status,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	private function insert_missing_js_files( array $links, array $js_files ) {
		$placeholders = array();
		$values       = array();
		$now          = Urlslab_Data::get_now();

		foreach ( $links as $url => $urld_id ) {
			if ( ! isset( $js_files[ $urld_id ] ) && ! $this->is_blacklisted_url( $url ) ) {
				$placeholders[] = '(%d,%s,%s,%s)';
				array_push(
					$values,
					$urld_id,
					$url,
					Urlslab_JS_Cache_Row::STATUS_NEW,
					$now
				);
			}
		}
		if ( ! empty( $values ) ) {
			global $wpdb;
			$query = 'INSERT IGNORE INTO ' . URLSLAB_JS_CACHE_TABLE . ' (url_id,url,status,status_changed) VALUES ' . implode( ', ', $placeholders );
			$wpdb->query( $wpdb->prepare( $query, $values ) ); // phpcs:ignore
		}
	}

	public function minify_head_content( $content ) {
		return $this->minify_content( $content, true );
	}

	public function minify_body_content( $content ) {
		return $this->minify_content( $content );
	}


	public function minify_content( $content, bool $is_head = false ) {
		if ( empty( $content ) || is_404() || ! $this->get_option( self::SETTING_NAME_HTML_MINIFICATION ) ) {
			return $content;
		}
		try {
			$htmlMin = new \voku\helper\HtmlMin();
			$htmlMin->doOptimizeViaHtmlDomParser();
			$htmlMin->doRemoveComments( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_COMMENTS ) );
			$htmlMin->doSumUpWhitespace( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doRemoveWhitespaceAroundTags( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doOptimizeAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doKeepHttpAndHttpsPrefixOnExternalAttributes( true );
			if ( $is_head ) {
				$htmlMin->doRemoveHttpPrefixFromAttributes( false );
				$htmlMin->doRemoveHttpsPrefixFromAttributes( false );
			} else {
				$htmlMin->doRemoveHttpPrefixFromAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX ) );
				$htmlMin->doRemoveHttpsPrefixFromAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_HTTP_PREFIX ) );
			}
			$htmlMin->doKeepHttpAndHttpsPrefixOnExternalAttributes( true );
			$htmlMin->doRemoveDefaultAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveDeprecatedAnchorName( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedScriptCharsetAttribute( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromScriptTag( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromStylesheetLink( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDeprecatedTypeFromStyleAndLinkTag( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_DEPRECATED ) );
			$htmlMin->doRemoveDefaultTypeFromButton( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveEmptyAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doRemoveValueFromEmptyInput( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_ATTRIBUTES ) );
			$htmlMin->doSortCssClassNames( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_SORT ) );
			$htmlMin->doSortHtmlAttributes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_SORT ) );
			$htmlMin->doRemoveSpacesBetweenTags( $is_head && $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_WHITESPACES ) );
			$htmlMin->doRemoveOmittedQuotes( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED ) );
			$htmlMin->doRemoveOmittedHtmlTags( $this->get_option( self::SETTING_NAME_HTML_MINIFICATION_REMOVE_OMITTED ) );

			return $htmlMin->minify( $content );
		} catch ( \Exception $e ) {
			return $content;
		}
	}

	/**
	 * @param DOMDocument $document
	 *
	 * @return void
	 */
	private function css_processing( DOMDocument $document ): void {
		if ( ! $this->get_option( self::SETTING_NAME_CSS_PROCESSING ) ) {
			return;
		}
		try {
			$xpath     = new DOMXPath( $document );
			$css_links = $xpath->query( "//link[@rel='stylesheet' and (@type='text/css' or not(@type)) and @href ]" );
			$links     = array();
			foreach ( $css_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'href' ) ] ) ) {
					try {
						$url = new Urlslab_Url( $link_object->getAttribute( 'href' ) );
						if ( $url->is_same_domain_url() ) {
							$links[ $link_object->getAttribute( 'href' ) ] = $url->get_url_id();
						}
					} catch ( Exception $e ) {
					}
				}
			}

			$css_files = Urlslab_CSS_Cache_Row::get_css_files( $links );

			$remove_elements = array();
			if ( $this->get_option( self::SETTING_NAME_CSS_MAX_SIZE ) > 0 ) {
				foreach ( $css_links as $link_object ) {
					if ( isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
						$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
						if ( Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_object->get_status() && $this->get_option( self::SETTING_NAME_CSS_MAX_SIZE ) > $css_object->get_filesize() ) {
							$new_elm = $document->createElement( 'style', $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ]->get_css_content() );
							$new_elm->setAttribute( 'type', 'text/css' );
							if ( $link_object->hasAttribute( 'media' ) ) {
								$new_elm->setAttribute( 'media', $link_object->getAttribute( 'media' ) );
							}
							if ( $link_object->hasAttribute( 'id' ) ) {
								$new_elm->setAttribute( 'id', $link_object->getAttribute( 'id' ) );
							}
							$link_object->setAttribute( 'urlslab-old', 'should-remove' );
							$new_elm->setAttribute( 'urlslab-css', '1' );
							$link_object->parentNode->insertBefore( $new_elm, $link_object );
							$remove_elements[] = $link_object;
						}
					}
				}
			}

			if ( $this->get_option( self::SETTING_NAME_CSS_MERGE ) ) {
				$merged_css_files = array();
				$first_node       = null;
				foreach ( $css_links as $link_object ) {
					if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
						$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
						if ( Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_object->get_status() ) {
							$remove_elements[]  = $link_object;
							$merged_css_files[] = $css_object;
							if ( null === $first_node ) {
								$first_node = $link_object;
							}
						}
					}
				}
				if ( ! empty( $merged_css_files ) && null !== $first_node ) {
					$new_elm = $document->createElement( 'link' );
					$new_elm->setAttribute( 'rel', 'stylesheet' );
					$new_elm->setAttribute( 'href', $this->get_merge_css_url( $merged_css_files ) );
					$first_node->parentNode->insertBefore( $new_elm, $first_node );
				}
			} else if ( $this->get_option( self::SETTING_NAME_CSS_MINIFICATION ) ) {
				foreach ( $css_links as $link_object ) {
					if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'href' ) ], $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) {
						$css_object = $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ];
						if ( Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_object->get_status() ) {
							$link_object->setAttribute( 'href', $this->get_merge_css_url( array( $css_files[ $links[ $link_object->getAttribute( 'href' ) ] ] ) ) );
						}
					}
				}

			}

			foreach ( $remove_elements as $element ) {
				$element->parentNode->removeChild( $element );
			}

			$this->insert_missing_css_files( $links, $css_files );

		} catch ( Exception $e ) {
		}
	}

	/**
	 * @param Urlslab_CSS_Cache_Row[] $merged_css_files
	 *
	 * @return string|null
	 */
	public function get_merge_css_url( array $merged_css_files ) {
		$ids = array();
		foreach ( $merged_css_files as $css_file ) {
			$ids[] = $css_file->get_url_id();
		}

		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			//URL to standard proxy script
			return site_url( self::DOWNLOAD_CSS_URL_PATH . urlencode( implode( '_', $ids ) ) . '.css?ver=' . $this->get_option( self::SETTING_NAME_CSS_CACHE_VALID_FROM ) );
		}

		return site_url( '?action=' . urlencode( self::DOWNLOAD_CSS_URL_PATH ) . '&css=' . urlencode( implode( '_', $ids ) ) . '&ver=' . $this->get_option( self::SETTING_NAME_CSS_CACHE_VALID_FROM ) );
	}

	/**
	 * @param Urlslab_JS_Cache_Row[] $merged_js_files
	 *
	 * @return string|null
	 */
	public function get_merge_js_url( array $merged_js_files ) {
		$ids = array();
		foreach ( $merged_js_files as $js_file ) {
			$ids[] = $js_file->get_url_id();
		}

		if ( ! empty( get_option( 'permalink_structure' ) ) ) {
			//URL to standard proxy script
			return site_url( self::DOWNLOAD_JS_URL_PATH . urlencode( implode( '_', $ids ) ) . '.js?ver=' . $this->get_option( self::SETTING_NAME_JS_CACHE_VALID_FROM ) );
		}

		return site_url( '?action=' . urlencode( self::DOWNLOAD_JS_URL_PATH ) . '&js=' . urlencode( implode( '_', $ids ) ) . '&ver=' . $this->get_option( self::SETTING_NAME_JS_CACHE_VALID_FROM ) );
	}

	public function output_css() {
		global $_SERVER;

		if ( isset( $_GET['action'] ) && isset( $_GET['css'] ) && self::DOWNLOAD_CSS_URL_PATH === $_GET['action'] ) {
			$css = $_GET['css'];
		} else {
			if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
				return 'Path to file not detected.';
			}
			$path = pathinfo( $_SERVER['REQUEST_URI'] );
			$dirs = explode( '/', $path['filename'] );
			$css  = array_pop( $dirs );
		}

		@set_time_limit( 0 );
		$expires_offset = $this->get_option( self::SETTING_NAME_CSS_CACHE_TTL );

		if ( Urlslab_File_Cache::get_instance()->exists( $css, self::CSS_CACHE_GROUP, false, $this->get_option( self::SETTING_NAME_CSS_CACHE_VALID_FROM ) ) ) {
			$css_content = Urlslab_File_Cache::get_instance()->get( $css, self::CSS_CACHE_GROUP );
		} else {
			$css_content = $this->get_css_content( $css );
			Urlslab_File_Cache::get_instance()->set( $css, $css_content, self::CSS_CACHE_GROUP, $expires_offset );
		}

		status_header( 200 );
		header( 'Content-Type: text/css; charset=utf-8' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . strlen( $css_content ) );

		echo $css_content;
	}

	public function output_js() {
		global $_SERVER;

		if ( isset( $_GET['action'] ) && isset( $_GET['js'] ) && self::DOWNLOAD_JS_URL_PATH === $_GET['action'] ) {
			$js = $_GET['js'];
		} else {
			if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
				return 'Path to file not detected.';
			}
			$path = pathinfo( $_SERVER['REQUEST_URI'] );
			$dirs = explode( '/', $path['filename'] );
			$js   = array_pop( $dirs );
		}

		@set_time_limit( 0 );
		$expires_offset = $this->get_option( self::SETTING_NAME_JS_CACHE_TTL );

		if ( Urlslab_File_Cache::get_instance()->exists( $js, self::JS_CACHE_GROUP, false, $this->get_option( self::SETTING_NAME_JS_CACHE_VALID_FROM ) ) ) {
			$js_content = Urlslab_File_Cache::get_instance()->get( $js, self::JS_CACHE_GROUP );
		} else {
			$js_content = $this->get_js_content( $js );
			Urlslab_File_Cache::get_instance()->set( $js, $js_content, self::JS_CACHE_GROUP, $expires_offset );
		}

		status_header( 200 );
		header( 'Content-Type: application/javascript; charset=utf-8' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . strlen( $js_content ) );

		echo $js_content;
	}

	/**
	 * @param mixed $css
	 *
	 * @return string
	 */
	private function get_css_content( string $css ): string {
		$css_content = '';
		$css_files   = explode( '_', $css );
		$css_objects = Urlslab_CSS_Cache_Row::get_css_files( $css_files );
		foreach ( $css_files as $css_file_id ) {
			if ( isset( $css_objects[ $css_file_id ] ) && Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_objects[ $css_file_id ]->get_status() ) {
				$css_content .= $css_objects[ $css_file_id ]->get_css_content() . "\n\n";
			}
		}

		return $css_content;
	}

	/**
	 * @param mixed $js
	 *
	 * @return string
	 */
	private function get_js_content( string $js ): string {
		$js_content = '';
		$js_files   = explode( '_', $js );
		$js_objects = Urlslab_JS_Cache_Row::get_js_files( $js_files );
		foreach ( $js_files as $js_file_id ) {
			if ( isset( $js_objects[ $js_file_id ] ) && Urlslab_JS_Cache_Row::STATUS_ACTIVE == $js_objects[ $js_file_id ]->get_status() ) {
				$js_content .= $js_objects[ $js_file_id ]->get_js_content() . "\n\n";
			}
		}

		return $js_content;
	}

	private function is_blacklisted_url( string $url ): bool {
		return false !== strpos( $url, 'wordfence_syncAttackData' );
	}

	private function js_processing( DOMDocument $document ) {
		if ( ! $this->get_option( self::SETTING_NAME_JS_PROCESSING ) ) {
			return;
		}

		try {
			$xpath    = new DOMXPath( $document );
			$js_links = $xpath->query( '//script[@src]' );
			$links    = array();
			foreach ( $js_links as $link_object ) {
				if ( ! isset( $links[ $link_object->getAttribute( 'src' ) ] ) && ! $this->is_blacklisted_url( $link_object->getAttribute( 'src' ) ) ) {
					try {
						$url = new Urlslab_Url( $link_object->getAttribute( 'src' ) );
						if ( $url->is_same_domain_url() ) {
							$links[ $link_object->getAttribute( 'src' ) ] = $url->get_url_id();
						}
					} catch ( Exception $e ) {
					}
				}
			}

			$js_files = Urlslab_JS_Cache_Row::get_js_files( $links );

			$remove_elements = array();
			if ( $this->get_option( self::SETTING_NAME_JS_MAX_SIZE ) > 0 ) {
				foreach ( $js_links as $link_object ) {
					if ( isset( $links[ $link_object->getAttribute( 'src' ) ], $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) {
						$js_object = $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ];
						if ( Urlslab_JS_Cache_Row::STATUS_ACTIVE == $js_object->get_status() && $this->get_option( self::SETTING_NAME_JS_MAX_SIZE ) > $js_object->get_filesize() ) {
							$new_elm = $document->createElement( 'script', $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ]->get_js_content() );
							if ( $link_object->hasAttribute( 'id' ) ) {
								$new_elm->setAttribute( 'id', $link_object->getAttribute( 'id' ) );
							}
							$link_object->setAttribute( 'urlslab-old', 'should-remove' );
							$new_elm->setAttribute( 'urlslab-js', '1' );
							$link_object->parentNode->insertBefore( $new_elm, $link_object );
							$remove_elements[] = $link_object;
						}
					}
				}
			}

			if ( $this->get_option( self::SETTING_NAME_JS_MINIFICATION ) ) {
				foreach ( $js_links as $link_object ) {
					if ( ! $link_object->hasAttribute( 'urlslab-old' ) && isset( $links[ $link_object->getAttribute( 'src' ) ], $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) {
						$js_object = $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ];
						if ( Urlslab_JS_Cache_Row::STATUS_ACTIVE == $js_object->get_status() ) {
							$link_object->setAttribute( 'src', $this->get_merge_js_url( array( $js_files[ $links[ $link_object->getAttribute( 'src' ) ] ] ) ) );
						}
					}
				}

			}

			foreach ( $remove_elements as $element ) {
				$element->parentNode->removeChild( $element );
			}

			$this->insert_missing_js_files( $links, $js_files );

		} catch ( Exception $e ) {
		}
	}

	public function update_option( $option_id, $value ): bool {
		switch ( $option_id ) {
			case self::SETTING_NAME_JS_MINIFICATION:
				$this->update_option( self::SETTING_NAME_JS_CACHE_VALID_FROM, time() );
				break;
			case self::SETTING_NAME_CSS_MINIFICATION:
			case self::SETTING_NAME_CSS_MERGE:
				$this->update_option( self::SETTING_NAME_CSS_CACHE_VALID_FROM, time() );
				break;
			default:
				break;
		}

		return parent::update_option( $option_id, $value );
	}
}
