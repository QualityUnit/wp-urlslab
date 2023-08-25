<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Search_Replace extends Urlslab_Widget {
	public const SLUG = 'urlslab-search-and-replace';

	private $rules = array();
	private $loaded = false;

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_raw_content', $this, 'content_raw_hook', 1 );
	}

	public function get_widget_slug(): string {
		return Urlslab_Search_Replace::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Search and Replace' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_FREE );
	}

	public function get_widget_description(): string {
		return __( 'Powerful tools that can automatically replace inaccurate URLs and content seamlessly' );
	}

	public function content_raw_hook( $content ) {
		if ( is_admin() ) {
			return $content;
		}
		foreach ( $this->get_rules() as $rule ) {
			switch ( $rule->get_search_type() ) {
				case Urlslab_Search_Replace_Row::TYPE_REGEXP:
					$content = preg_replace( '/' . str_replace( '/', '\\/', $rule->get_str_search() ) . '/uim', $rule->get_str_replace(), $content );

					break;

				case Urlslab_Search_Replace_Row::TYPE_PLAIN_TEXT:
				default:
					$content = str_replace( $rule->get_str_search(), $rule->get_str_replace(), $content );
			}
		}

		return $content;
	}

	public function is_api_key_required(): bool {
		return false;
	}

	protected function add_options() {}

	/**
	 * @return Urlslab_Search_Replace_Row[]
	 */
	private function get_rules(): array {
		if ( ! $this->loaded ) {
			global $wpdb;
			try {
				$results     = $wpdb->get_results( 'SELECT * FROM ' . URLSLAB_SEARCH_AND_REPLACE_TABLE, 'ARRAY_A' ); // phpcs:ignore
				$current_url = Urlslab_Url::get_current_page_url()->get_url();
				$is_logged   = is_user_logged_in();
				foreach ( $results as $row ) {
					$obj_search = new Urlslab_Search_Replace_Row( $row );

					if ( '.*' !== $obj_search->get_url_filter() && ! preg_match( '/' . preg_quote( $obj_search->get_url_filter(), '/' ) . '/uim', $current_url ) ) {
						continue;
					}

					switch ( $obj_search->get_login_status() ) {
						case Urlslab_Search_Replace_Row::LOGIN_STATUS_LOGGED_IN:
							if ( ! $is_logged ) {
								continue 2;
							}
							break;
						case Urlslab_Search_Replace_Row::LOGIN_STATUS_LOGGED_OUT:
							if ( $is_logged ) {
								continue 2;
							}
							break;
						case Urlslab_Search_Replace_Row::LOGIN_STATUS_ALL: //continue to default
						default:
							break;
					}
					$this->rules[ $obj_search->get_id() ] = $obj_search;
				}
			} catch ( Exception $e ) {
			}
			$this->loaded = true;
		}

		return $this->rules;
	}
}
