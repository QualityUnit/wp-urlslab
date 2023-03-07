<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Search_Replace extends Urlslab_Widget {
	const SLUG = 'urlslab-search-and-replace';

	private $rules = array();
	private $loaded = false;

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_head_content_raw', $this, 'theContentRawHook', 1 );
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_content_raw', $this, 'theContentRawHook', 1 );
	}

	/**
	 * @return string
	 */
	public function get_widget_slug(): string {
		return Urlslab_Search_Replace::SLUG;
	}

	/**
	 * @return string
	 */
	public function get_widget_title(): string {
		return __( 'Search & Replace' );
	}

	/**
	 * @return string
	 */
	public function get_widget_description(): string {
		return __( '[HTML] Search and replace on the fly any text in the web page HTML.' );
	}


	public function theContentRawHook( $content ) {
		foreach ( $this->get_rules() as $rule ) {
			switch ( $rule->get( 'search_type' ) ) {
				case Urlslab_Search_Replace_Row::TYPE_REGEXP:
					$content = preg_replace( '/' . str_replace( '/', '\\/', $rule->get( 'str_search' ) ) . '/uim', $rule->get( 'str_replace' ), $content );
					break;
				case Urlslab_Search_Replace_Row::TYPE_PLAIN_TEXT:
				default:
					$content = str_replace( $rule->get( 'str_search' ), $rule->get( str_replace ), $content );
			}
		}

		return $content;
	}

	/**
	 * @return Urlslab_Search_Replace_Row[]
	 */
	private function get_rules(): array {
		if ( ! $this->loaded ) {
			global $wpdb;
			$results = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_SEARCH_AND_REPLACE_TABLE ), 'ARRAY_A' ); // phpcs:ignore
			$current_url = $this->get_current_page_url()->get_url();
			foreach ( $results as $row ) {
				if ( '.*' !== $row->get( 'url_filter' ) && ! preg_match( '/' . str_replace( '/', '\\/', $row->get( 'url_filter' ) ) . '/uim', $current_url ) ) {
					continue;
				}
				$obj_search                              = new Urlslab_Search_Replace_Row( $row );
				$this->rules[ $obj_search->get( 'id' ) ] = $obj_search;
			}
			$this->loaded = true;
		}

		return $this->rules;
	}


	public function is_api_key_required() {
		return false;
	}


	protected function add_options() {}
}
