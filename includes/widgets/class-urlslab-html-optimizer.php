<?php

// phpcs:disable WordPress
require_once URLSLAB_PLUGIN_DIR . '/includes/data/class-urlslab-css-cache-row.php';

class Urlslab_Html_Optimizer extends Urlslab_Widget {
	public const SLUG = 'urlslab-css-optimizer';

	public const DOWNLOAD_CSS_URL_PATH = 'urlslab-css/';

	public const SETTING_NAME_CSS_MAX_SIZE = 'urlslab_css_max_size';
	public const SETTING_NAME_CSS_CACHE_TTL = 'urlslab_css_ttl';
	const SETTING_NAME_HTML_MINIFICATION = 'urlslab_html_minification';
	const SETTING_NAME_CSS_MINIFICATION = 'urlslab_css_minification';
	const SETTING_NAME_JS_MINIFICATION = 'urlslab_js_minification';
	const SETTING_NAME_CSS_PROCESSING = 'urlslab_css_processing';
	const SETTING_NAME_JS_PROCESSING = 'urlslab_js_processing';
	const SETTING_NAME_CSS_MERGE = 'urlslab_css_merge';
	const SETTING_NAME_JS_MERGE = 'urlslab_js_merge';

	public function __construct() {}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_body_content', $this, 'content_hook', 100 );
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'content_hook' );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_content', $this, 'minify_content', 0 );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_PERFORMANCE, self::LABEL_FREE );
	}

	public function get_widget_slug(): string {
		return Urlslab_Html_Optimizer::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'HTML Optimization' );
	}

	public function get_widget_description(): string {
		return __( 'Improve page performance and reduce content-blocker requests using inline CSS instead of external CSS files and minification' );
	}

	public function content_hook( DOMDocument $document ) {
		if ( is_admin() || is_404() ) {
			return;
		}


		$this->css_processing( $document );
	}

	public static function update_settings( array $new_settings ) {}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'minify',
			__( 'Content minification' ),
			__( 'Minification process removes from HTML content uneccessary spaces or comments to save network traffic' ),
			array( self::LABEL_EXPERT )
		);
		$this->add_option_definition(
			self::SETTING_NAME_HTML_MINIFICATION,
			false,
			true,
			__( 'HTML Minification' ),
			__( 'Minify HTML source by removing extra whitespaces, comments and other unneeded characters without breaking the content structure. As a result pages become smaller in size and load faster. It will also prepare the HTML for better gzip results, by re-ranging (sort alphabetical) attributes and css-class-names.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'minify'
		);


		$this->add_options_form_section( 'css', __( 'CSS' ), __( 'Optimising resources like CSS files is key to ensuring a fast website. Setting up a size limit and expiration date for those files helps maximize the website\'s performance and loading speed. These settings can significantly reduce the amount of time needed for a page to load and enhance the user experience.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_CSS_PROCESSING,
			false,
			true,
			__( 'Process CSS files' ),
			__( 'Downloads CSS files to local database and optimize them.' ),
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
			__( 'Define how long the CSS file will be stored in the database.' ),
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
			self::SETTING_NAME_CSS_MAX_SIZE,
			0,
			true,
			__( 'Load smaller CSS files into HTML (bytes)' ),
			__( 'Define the size limit of the CSS file, which will be loaded to the HTML content. e.g. if you set 30000 bytes, all smaller css files as 30000 bytes will be loaded with main html content. Set to 0 if no css file should be included into main html.' ),
			self::OPTION_TYPE_NUMBER,
			false,
			function( $value ) {
				return is_numeric( $value ) && 0 <= $value;
			},
			'css'
		);
		$this->add_option_definition(
			self::SETTING_NAME_CSS_MINIFICATION,
			false,
			false,
			__( 'CSS Minification' ),
			__( 'Minify CSS files by removing whitespaces, stripping comments, combines files (incl. @import statements and small assets in CSS files), and optimizes/shortens a few common programming patterns.' ),
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
			__( 'Merge all CSS files used in page to one file' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'css'
		);


		$this->add_options_form_section( 'js', __( 'Javascript' ), __( 'Optimising Javascript files.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_JS_PROCESSING,
			false,
			true,
			__( 'Javascript Processing' ),
			__( 'Download JS files to database and do next processing like minification, merging, etc.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MINIFICATION,
			false,
			false,
			__( 'JS Minification' ),
			__( 'Minify JS files by removing whitespaces, stripping comments, combines files and optimizes/shortens a few common programming patterns.' ),
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'js'
		);
		$this->add_option_definition(
			self::SETTING_NAME_JS_MERGE,
			false,
			true,
			__( 'Merge Javascript files' ),
			__( 'Merge all Javascript files used in page to one file' ),
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

	public function minify_content( $content ) {
		if ( empty( $content ) || ! $this->get_option( self::SETTING_NAME_HTML_MINIFICATION ) ) {
			return $content;
		}
		$htmlMin = new \voku\helper\HtmlMin();
		$htmlMin->doOptimizeViaHtmlDomParser();
		$htmlMin->doRemoveComments();
		$htmlMin->doSumUpWhitespace();
		$htmlMin->doRemoveWhitespaceAroundTags();
		$htmlMin->doOptimizeAttributes();
		$htmlMin->doRemoveHttpPrefixFromAttributes();
		$htmlMin->doRemoveHttpsPrefixFromAttributes();
		$htmlMin->doKeepHttpAndHttpsPrefixOnExternalAttributes();
		$htmlMin->doRemoveDefaultAttributes();
		$htmlMin->doRemoveDeprecatedAnchorName();
		$htmlMin->doRemoveDeprecatedScriptCharsetAttribute();
		$htmlMin->doRemoveDeprecatedTypeFromScriptTag();
		$htmlMin->doRemoveDeprecatedTypeFromStylesheetLink();
		$htmlMin->doRemoveDeprecatedTypeFromStyleAndLinkTag();
		$htmlMin->doRemoveDefaultTypeFromButton();
		$htmlMin->doRemoveEmptyAttributes();
		$htmlMin->doRemoveValueFromEmptyInput();
		$htmlMin->doSortCssClassNames();
		$htmlMin->doSortHtmlAttributes();
		$htmlMin->doRemoveSpacesBetweenTags();
		$htmlMin->doRemoveOmittedQuotes();
		$htmlMin->doRemoveOmittedHtmlTags();

		return $htmlMin->minify( $content );
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
							$remove_elements[]                                        = $link_object;
							$merged_css_files[ $link_object->getAttribute( 'href' ) ] = $css_object;
						}
						if ( null === $first_node ) {
							$first_node = $link_object;
						}
					}
				}
				if ( ! empty( $merged_css_files ) && null !== $first_node ) {
					$new_elm = $document->createElement( 'link' );
					$new_elm->setAttribute( 'rel', 'stylesheet' );
					$new_elm->setAttribute( 'href', $this->get_merge_css_url( $merged_css_files ) );
					$first_node->parentNode->insertBefore( $new_elm, $first_node );
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
			return site_url( self::DOWNLOAD_CSS_URL_PATH . urlencode( implode( '_', $ids ) ) . '.css' );
		}

		return site_url( '?action=' . urlencode( self::DOWNLOAD_CSS_URL_PATH ) . '&css=' . urlencode( implode( '_', $ids ) ) );
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

		$css_content = '';
		$css_files   = explode( '_', $css );
		foreach ( $css_files as $css_file ) {
			try {
				$css_object = new Urlslab_CSS_Cache_Row( array( 'url_id' => (int) $css_file ) );
				if ( $css_object->load() ) {
					if ( Urlslab_CSS_Cache_Row::STATUS_ACTIVE == $css_object->get_status() ) {
						$css_content .= $css_object->get_css_content() . "\n";
					}
				}
			} catch ( Exception $e ) {
			}
		}

		status_header( 200 );
		header( 'Content-Type: text/css; charset=utf-8' );
		header( 'Content-Transfer-Encoding: binary' );
		header( 'Pragma: public' );

		$expires_offset = $this->get_option( self::SETTING_NAME_CSS_CACHE_TTL );
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires_offset ) . ' GMT' );
		header( "Cache-Control: public, max-age=$expires_offset" );
		header( 'Content-length: ' . strlen( $css_content ) );

		echo $css_content;
	}
}
