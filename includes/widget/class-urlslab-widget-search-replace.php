<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Widget_Search_Replace extends Urlslab_Widget {
	public const SLUG = 'urlslab-search-and-replace';
	const SETTING_NAME_RULES_VALID_FROM = 'urlslab-sr-rules-valid-from';

	private $rules = array();
	private $loaded = false;

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_content', $this, 'content_raw_hook', 1 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Search_Replace::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Search and Replace', 'urlslab' );
	}

	public function get_widget_group() {
		return __( 'Tools', 'urlslab' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_FREE );
	}

	public function get_widget_description(): string {
		return __( 'Powerful tools that can automatically replace inaccurate URLs and content seamlessly', 'urlslab' );
	}

	public function content_raw_hook( $content ) {
		if ( is_admin() ) {
			return $content;
		}
		foreach ( $this->get_rules() as $rule ) {
			switch ( $rule->get_search_type() ) {
				case Urlslab_Data_Search_Replace::TYPE_REGEXP:
					$content = preg_replace( '/' . str_replace( '/', '\\/', $rule->get_str_search() ) . '/uim', $rule->get_str_replace(), $content );

					break;

				case Urlslab_Data_Search_Replace::TYPE_PLAIN_TEXT:
				default:
					$content = str_replace( $rule->get_str_search(), $rule->get_str_replace(), $content );
			}
		}

		return $content;
	}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {
		$this->add_option_definition(
			self::SETTING_NAME_RULES_VALID_FROM,
			0,
			true,
			function() {
				return __( 'Rules Validity', 'urlslab' );
			},
			function() {
				return __( 'Validity of rules cache.', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN
		);
	}

	/**
	 * @return Urlslab_Data_Search_Replace[]
	 */
	private function get_rules(): array {
		if ( ! $this->loaded ) {

			try {
				$results = Urlslab_Cache::get_instance()->get( 'rules', self::SLUG, $found, false, $this->get_option( self::SETTING_NAME_RULES_VALID_FROM ) );
				if ( ! $found ) {
					global $wpdb;
					$results = $wpdb->get_results( 'SELECT * FROM ' . URLSLAB_SEARCH_AND_REPLACE_TABLE, 'ARRAY_A' ); // phpcs:ignore
					Urlslab_Cache::get_instance()->set( 'rules', $results, self::SLUG );
				}
				$current_url       = Urlslab_Url::get_current_page_url()->get_url();
				$is_logged         = is_user_logged_in();
				$current_post_type = get_post_type();

				foreach ( $results as $row ) {
					$obj_search = new Urlslab_Data_Search_Replace( $row );

					if ( '.*' !== $obj_search->get_url_filter() && ! preg_match( '/' . preg_quote( $obj_search->get_url_filter(), '/' ) . '/uim', $current_url ) ) {
						continue;
					}

					switch ( $obj_search->get_login_status() ) {
						case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_IN:
							if ( ! $is_logged ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::LOGIN_STATUS_LOGGED_OUT:
							if ( $is_logged ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::LOGIN_STATUS_ALL: //continue to default
						default:
							break;
					}

					switch ( $obj_search->get_is_single() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_single() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_single() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_singular() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_singular() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_singular() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_attachment() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_attachment() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_attachment() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_page() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_page() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_page() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_home() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_home() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_home() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_front_page() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_front_page() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_front_page() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_category() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_category() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_category() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_search() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_search() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_search() ) {
								continue 2;
							}
							break;
						default:
							break;
					}
					switch ( $obj_search->get_is_tag() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_tag() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_tag() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_author() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_author() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_author() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_archive() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_archive() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_archive() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_sticky() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_sticky() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_sticky() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_tax() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_tax() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_tax() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_feed() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_feed() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_feed() ) {
								continue 2;
							}
							break;
						default:
							break;
					}

					switch ( $obj_search->get_is_paged() ) {
						case Urlslab_Data_Search_Replace::YES:
							if ( ! is_paged() ) {
								continue 2;
							}
							break;
						case Urlslab_Data_Search_Replace::NO:
							if ( is_paged() ) {
								continue 2;
							}
							break;
						default:
							break;
					}


					if ( ! empty( trim( $obj_search->get_post_types() ) ) ) {
						$post_types = preg_split( '/(,|\n|\t)\s*/', $obj_search->get_post_types() );
						if ( ! empty( $post_types ) && ! empty( $current_post_type ) ) {
							if ( ! in_array( $current_post_type, $post_types ) ) {
								continue;
							}
						}
					}

					$this->rules[ $obj_search->get_id() ] = $obj_search;
				}
			} catch ( Exception $e ) {
			}
			$this->loaded = true;
		}

		return $this->rules;
	}

	public function register_routes() {
		( new Urlslab_Api_Search_Replace() )->register_routes();
	}
}
