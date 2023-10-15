<?php

class Urlslab_Executor_Download_Url extends Urlslab_Executor {
	const TYPE = 'download_url';

	protected function init_execution( Urlslab_Task_Row $task_row ): bool {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		$url      = $task_row->get_data();
		$tmp_file = download_url( $url );
		if ( ! is_wp_error( $tmp_file ) ) {
			$task_row->set_result( json_encode( $this->process_page( file_get_contents( $tmp_file ) ) ) );
			unlink( $tmp_file );
			$this->execution_finished( $task_row );
		} else {
			$task_row->set_result( '' );
			$this->execution_failed( $task_row );

			return false;
		}

		return true;
	}

	private function process_page( $content ) {
		if ( empty( $content ) ) {
			return array();
		}

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {
			$result = array();

			$document->loadHTML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE );
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

			$headers           = $xpath->query( "//*[substring-after(name(), 'h') > 0 and substring-after(name(), 'h') < 4]" );
			$result['headers'] = array();
			foreach ( $headers as $header_element ) {
				$txt = trim( $header_element->textContent ); // phpcs:ignore
				if ( strlen( $txt ) > 0 ) {
					$result['headers'][] = array( 'tag' => strtoupper( $header_element->tagName ), 'value' => $txt ); // phpcs:ignore
				}
			}

			$result['texts'] = array();

			$body         = $document->getElementsByTagName( 'body' )->item( 0 );
			$text_elements = $body->getElementsByTagName( '*' );

			foreach ( $text_elements as $text_element ) {
				if ( count( $text_element->childNodes ) > 0 ) { // phpcs:ignore
					$result['texts'] = array_merge( $result['texts'], $this->get_child_node_texts( $text_element ) );
				} else if ( trim( $text_element->textContent ) !== '' ) { // phpcs:ignore
					$result['texts'][ trim( $text_element->textContent ) ] = 1; // phpcs:ignore
				}
			}
			$result['texts'] = array_keys( $result['texts'] );

			return $result;
		} catch ( Exception $e ) {
		}

		return '';
	}

	private function get_child_node_texts( DOMNode $node ): array {
		$result = array();
		foreach ( $node->childNodes as $child_node ) { // phpcs:ignore
			if ( $child_node->nodeType === XML_TEXT_NODE && trim( $child_node->textContent ) !== '' ) { // phpcs:ignore
				$result[ trim( $child_node->textContent ) ] = 1; // phpcs:ignore
			} else {
				$result = array_merge( $result, $this->get_child_node_texts( $child_node ) );
			}
		}

		return $result;
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
