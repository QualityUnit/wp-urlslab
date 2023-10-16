<?php


class Urlslab_Executor_Kw_Heatmap extends Urlslab_Executor {
	const TYPE = 'kw_heatmap';


	protected function schedule_subtasks( Urlslab_Task_Row $task_row ): bool {
		$data = $task_row->get_data();

		if ( ! isset( $data['country'] ) ) {
			$task_row->set_result( 'No country defined' );
			$this->execution_failed( $task_row );

			return false;
		}

		if ( isset( $data['urls'] ) && is_array( $data['urls'] ) && ! empty( $data['urls'] ) ) {
			$executor = new Urlslab_Executor_Url_Intersection();
			$executor->schedule( $data['urls'], $task_row );

			return true;
		} else {
			$task_row->set_result( 'No urls defined' );
			$this->execution_failed( $task_row );

			return false;
		}
	}

	protected function on_all_subtasks_done( Urlslab_Task_Row $task_row ): bool {
		$childs = $this->get_child_tasks( $task_row, Urlslab_Executor_Url_Intersection::TYPE );
		$matrix = Urlslab_Executor::get_executor( Urlslab_Executor_Url_Intersection::TYPE )->get_task_result( $childs[0] );

		if ( empty( $matrix ) ) {
			$task_row->set_result( 'No intersections found' );
			$this->execution_failed( $task_row );

			return true;
		}

		$data     = $task_row->get_data();
		$url_ids  = array();
		$sql_data = array();
		foreach ( $data['urls'] as $id => $url ) {
			try {
				$url_obj                           = new Urlslab_Url( $url, true );
				$url_ids[ $url_obj->get_url_id() ] = $id;
				$sql_data[]                        = $url_obj->get_url_id();
			} catch ( Exception $e ) {
			}
		}

		$query_ids = array();
		$queries   = array_keys( $matrix );
		foreach ( $queries as $query ) {
			$query_obj                               = new Urlslab_Serp_Query_Row( array( 'query' => $query ) );
			$query_ids[ $query_obj->get_query_id() ] = $query;
			$sql_data[]                              = $query_obj->get_query_id();
		}

		$sql_data[] = $data['country'];
		global $wpdb;
		$positions = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . URLSLAB_SERP_POSITIONS_TABLE . ' WHERE url_id IN (' . implode( ',', array_fill( 0, count( $url_ids ), '%d' ) ) . ') AND query_id IN (' . implode( ',', array_fill( 0, count( $query_ids ), '%d' ) ) . ') AND country=%s', $sql_data ), ARRAY_A );
		$query_positions = array();
		foreach ($positions as $row) {
			$query_positions[$row['query_id']][$row['url_id']] = (int) $row['position'];
		}

		$query_ids = array_flip( $query_ids );

		$recordset = array();
		foreach ($matrix as $keyword=>$kw_frequencies) {
			$record = array();
			$record['q'] = $keyword;
			foreach ($kw_frequencies as $url_id=>$frequency) {
				$record['f_' . $url_ids[$url_id]] = $frequency;
			}
			if (isset($query_positions[$query_ids[$keyword]])) {
				foreach ( $query_positions[ $query_ids[ $keyword ] ] as $url_id => $position ) {
					$record[ 'p_' . $url_ids[$url_id] ] = $position;
				}
			}
			$recordset[] = $record;
		}
		$task_row->set_result( $recordset );

		return parent::on_all_subtasks_done( $task_row );
	}

	protected function get_type(): string {
		return self::TYPE;
	}

}
