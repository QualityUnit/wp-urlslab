<?php

class Urlslab_Executor_Download_Url extends Urlslab_Executor {
	const TYPE = 'download_url';

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
			$tmp_file = download_url( $url );
			if ( ! is_wp_error( $tmp_file ) ) {
				$value = $this->process_page( $url, file_get_contents( $tmp_file ) );
				$task_row->set_result( $value );
				unlink( $tmp_file );
				$this->execution_finished( $task_row );
				set_transient( 'url_cache_' . $url_obj->get_url_id(), $value, DAY_IN_SECONDS );
			} else {
				$task_row->set_result( 'Failed to download url ' . $url );
				$this->execution_failed( $task_row );

				return false;
			}
		} catch ( Exception $e ) {
			$task_row->set_result( $e->getMessage() );
			$this->execution_failed( $task_row );

			return false;
		}


		return parent::on_all_subtasks_done( $task_row );
	}

	private function process_page( $url, $content ) {
		$result               = array();
		$result['url']        = $url;
		$result['page_title'] = '';
		$result['headers']    = array();
		$result['texts']      = array();

		if ( empty( $content ) ) {
			return $result;
		}

		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = get_bloginfo( 'charset' );
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		try {


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

			$headers = $xpath->query( "//*[substring-after(name(), 'h') > 0 and substring-after(name(), 'h') < 4]" );

			foreach ( $headers as $header_element ) {
				$txt = trim( $header_element->textContent ); // phpcs:ignore
				if ( strlen( $txt ) > 0 ) {
					$result['headers'][] = array(
						'tag'   => strtoupper( $header_element->tagName ), // phpcs:ignore
						'value' => $txt,
					);
				}
			}

			$body          = $document->getElementsByTagName( 'body' )->item( 0 );
			$text_elements = $body->getElementsByTagName( '*' );

			foreach ( $text_elements as $text_element ) {
				if ( count( $text_element->childNodes ) > 0 ) { // phpcs:ignore
					$result['texts'] = array_merge( $result['texts'], $this->get_child_node_texts( $text_element ) );
				} else if ( trim( $text_element->textContent ) !== '' ) { // phpcs:ignore
					$result['texts'][ trim( $text_element->textContent ) ] = 1; // phpcs:ignore
				}
			}
			$result['texts'] = array_keys( $result['texts'] );
		} catch ( Exception $e ) {
		}

		return $result;
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
