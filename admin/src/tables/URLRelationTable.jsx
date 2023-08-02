import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, IconButton,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function URLRelationTable( { slug } ) {
	const paginationId = 'src_url_id';
	const optionalSelector = 'dest_url_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		src_url_name: __( 'Source URL' ),
		dest_url_name: __( 'Destination URL' ),
		pos: __( 'SEO Rank' ),
		is_locked: __( 'Locked' ),
		created_date: __( 'Updated' ),
	};

	const rowEditorCells = {
		src_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.src_url_name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, src_url_name: val } ) } required />,
		dest_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.dest_url_name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, dest_url_name: val } ) } required />,
		pos: <InputField liveUpdate type="number" defaultValue="1" min="0" max="100" label={ header.pos } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, pos: val } ) } required />,
		is_locked: <Checkbox defaultValue={ false } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_locked: val } ) }>{ header.is_locked }</Checkbox>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
		} ),
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.src_url_name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.dest_url_name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'pos', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.pos }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'is_locked', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.is_locked }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'created_date', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.created_date }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex editRow-buttons">
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell, optionalSelector, id: 'src_url_name' } ) }
							tooltipClass="align-left"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
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
				options={ {
					header, rowEditorCells, title: 'Add New Related Article', data, slug, url, paginationId, optionalSelector, rowToEdit, id: 'src_url_name', deleteCSVCols: [ paginationId, 'dest_url_id' ],
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
