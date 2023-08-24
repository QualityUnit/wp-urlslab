import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat, RowActionButtons, SortBy,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
// import { active } from 'd3';

export default function GeneratorProcessesTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'task_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );

	const url = { filters, sorting };

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { selectRows, deleteRow, deleteMultipleRows } = useChangeRow( { data, url, slug, paginationId } );

	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const generatorType = {
		S: __( 'Shortcode Generator' ),
		P: __( 'Post Creation Generator' ),
	};

	const generatorStatus = {
		N: __( 'New' ),
		P: __( 'Processing' ),
		A: __( 'Done' ),
		D: __( 'Failed' ),
	};

	const header = {
		task_id: __( 'ID' ),
		generator_type: __( 'Generator Type' ),
		task_status: __( 'Status' ),
		task_data: __( 'Task Data' ),
		updated_at: __( 'Updated' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
		} ),
		columnHelper.accessor( 'task_id', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.task_id }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'generator_type', {
			cell: ( cell ) => generatorType[ cell.getValue() ],
			header: () => header.generator_type,
			size: 80,
		} ),
		columnHelper.accessor( 'task_status', {
			className: 'nolimit',
			cell: ( cell ) => generatorStatus[ cell.getValue() ],
			header: () => header.task_status,
			size: 80,
		} ),
		columnHelper.accessor( 'task_data', {
			cell: ( cell ) => cell.getValue(),
			header: () => header.task_data,
			size: 200,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: () => header.updated,
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
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ deleteMultipleRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ { header, data, slug, url, paginationId,
					rowToEdit,
					id: 'template_id',
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
