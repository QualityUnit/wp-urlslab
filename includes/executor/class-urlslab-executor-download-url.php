<?php

class Urlslab_Executor_Download_Url extends Urlslab_Executor {
	const TYPE = 'download_url';

	public function schedule( $data, Urlslab_Task_Row $parent = null ): Urlslab_Task_Row {
		$task = new Urlslab_Task_Row(
			array(
				'data'          => $data,
				'slug'          => $parent ? $parent->get_slug() : '',
				'parent_id'     => $parent->get_task_id(),
				'top_parent_id' => $parent->get_top_parent_id() ? $parent->get_top_parent_id() : $parent->get_task_id(),
				'executor_type' => $this->get_type(),
			),
			false
		);
		$task->insert();
		if ( $parent ) {
			$parent->set_subtasks( $parent->get_subtasks() + 1 );
		}

		return $task;
	}

	protected function execute_new( Urlslab_Task_Row $task_row ): bool {
		require_once ABSPATH . 'wp-admin/includes/file.php';

		$url      = $task_row->get_data();
		$tmp_file = download_url( $url );
		if ( ! is_wp_error( $tmp_file ) ) {
			$task_row->set_result( $this->apply_filter( file_get_contents( $tmp_file ) ) );
			unlink( $tmp_file );
			$this->execution_finished( $task_row );
		}

		return true;
	}

	private function apply_filter( $content ) {
		if ( empty( $content ) ) {
			return '';
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

			$titles = $xpath->query( "//title" );
			foreach ( $titles as $title_element ) {
				$txt = trim( $title_element->textContent );
				if ( strlen( $txt ) > 0 ) {
					$result[] = 'PAGE TITLE: ' . $txt;
					break;
				}
			}

			$headers = $xpath->query( "//*[substring-after(name(), 'h') > 0 and substring-after(name(), 'h') < 4]" );
			foreach ( $headers as $header_element ) {
				$txt = trim( $header_element->textContent );
				if ( strlen( $txt ) > 0 ) {
					$result[] = strtoupper( $header_element->tagName ) . ': ' . $txt;
				}
			}

			return implode( "\n", $result );
		} catch ( Exception $e ) {
		}

		return '';
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
