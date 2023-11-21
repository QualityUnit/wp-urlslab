<?php

class Urlslab_Executor_Download_Url extends Urlslab_Executor {
	const TYPE = 'download_url';
	private $current_text = array();

	protected function on_all_subtasks_done( Urlslab_Data_Task $task_row ): bool {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		$url = $task_row->get_data();

		try {
			$url_obj         = new Urlslab_Url( $url, true );
			$transient_value = get_transient( 'url_cache_' . $url_obj->get_url_id() );
			if ( false !== $transient_value ) {
				$task_row->set_result( $transient_value );
				$this->execution_finished( $task_row );

				return true;
			}
			$tmp_file = download_url( $url, 10 );
			if ( ! is_wp_error( $tmp_file ) ) {
				$value = $this->process_page( $url, file_get_contents( $tmp_file ) );
				unlink( $tmp_file );
			} else {
				$value          = $this->process_page( $url, '' );
				$value['error'] = __( 'Download failed.', 'urlslab' );
			}
		} catch ( Exception $e ) {
			$value          = $this->process_page( $url, '' );
			$value['error'] = $e->getMessage();
		}
		$task_row->set_result( $value );
		$this->execution_finished( $task_row );
		set_transient( 'url_cache_' . $url_obj->get_url_id(), $value, DAY_IN_SECONDS );

		return true;
	}

	private function process_page( $url, $content ) {
		$result               = array();
		$result['url']        = $url;
		$result['page_title'] = '';
		$result['texts']      = array();

		if ( empty( $content ) ) {
			return $result;
		}

		$charset = preg_match( '/<meta charset=["\'\\s]*?([a-zA-Z0-9\-]+)["\'\\s]*?>/', $content, $matches ) ? $matches[1] : 'UTF-8';

		$document                      = new DOMDocument( '1.0', $charset );
		$document->encoding            = $charset;
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$document->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', $charset ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE );


			libxml_clear_errors();
			libxml_use_internal_errors( $libxml_previous_state );
			$xpath = new DOMXPath( $document );

			$titles = $xpath->query( '//title' );
			foreach ( $titles as $title_element ) {
				$txt = trim( $title_element->textContent ); // phpcs:ignore
				if ( strlen( $txt ) > 0 ) {
					$result['page_title'] = $txt;
					break;
				}
			}

			$body = $document->getElementsByTagName( 'body' )->item( 0 );


			$result['texts'] = $this->extract_elements( $body );
			if ( count( $this->current_text ) ) {
				$result['texts'][]  = array( 'p', $this->current_text );
				$this->current_text = array();
			}
		} catch ( Exception $e ) {
		}

		return $result;
	}

	private function get_child_node_texts( DOMNode $node ): array {
		$result = array();
		foreach ( $node->childNodes as $child_node ) { // phpcs:ignore
			if ( $child_node->nodeType === XML_TEXT_NODE && trim( $child_node->textContent ) !== '' ) { // phpcs:ignore
				$result[] = $child_node->textContent; // phpcs:ignore
			} else {
				$result = array_merge( $result, $this->get_child_node_texts( $child_node ) );
			}
		}

		return $result;
	}

	protected function get_type(): string {
		return self::TYPE;
	}

	private function extract_elements( $element ): array {
		$result = array();
		if ( preg_match( '/^h[1-9]$/', $element->nodeName ) ) { // phpcs:ignore
			if ( count( $this->current_text ) ) {
				$result[]           = array( 'p', $this->current_text );
				$this->current_text = array();
			}

			$result[] = array( strtolower( $element->nodeName ), array( trim( $element->nodeValue ) ) ); // phpcs:ignore

			return $result;
		}

		if ( $element instanceof DOMElement && $element->hasChildNodes() ) {
			foreach ( $element->childNodes as $child ) { // phpcs:ignore
				$child_array = $this->extract_elements( $child );
				if ( ! empty( $child_array ) ) {
					$result = array_merge( $result, $child_array );
				}
			}
		} else {
			if (
				! in_array(
					strtolower( $element->nodeName ), // phpcs:ignore
					array(
						'button',
						'input',
						'#cdata-section',
						'script',
						'header',
						'meta',
						'img',
					)
				)
			) {
				if ( $element instanceof DOMText ) {
					$text = trim( $element->nodeValue ); // phpcs:ignore
					if ( strlen( $text ) > 0 ) {
						$this->current_text[] = $text;
					}
				}
			}
		}

		return $result;
	}

}
