import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat, RowActionButtons, SortBy, Tooltip,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
// import { active } from 'd3';

export default function GeneratorProcessesTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'task_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow } = useChangeRow( );

	const generatorType = {
		S: __( 'Shortcode' ),
		P: __( 'Post creation' ),
	};

	const generatorStatus = {
		N: __( 'New' ),
		P: __( 'Processing' ),
		A: __( 'Done' ),
		D: __( 'Failed' ),
	};

	const header = {
		task_id: __( 'ID' ),
		generator_type: __( 'Generator type' ),
		task_status: __( 'Status' ),
		task_data: __( 'Task data' ),
		error_log: __( 'Errors' ),
		updated: __( 'Last change' ),
	};

	useEffect( () => {
		useTableStore.setState( () => (
			{
				paginationId,
				slug,
				header,
				id: 'template_id',
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'task_id', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'generator_type', {
			cell: ( cell ) => generatorType[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_status', {
			className: 'nolimit',
			cell: ( cell ) => generatorStatus[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_data', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'error_log', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'task_id' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
