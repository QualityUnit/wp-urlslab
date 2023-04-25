import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function URLRelationTable( { slug } ) {
	const paginationId = 'src_url_id';
	const { table, setTable, rowToInsert, setInsertRow, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sorting ? '' : sorting }`;

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

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const header = {
		src_url_name: __( 'Source URL' ),
		dest_url_name: __( 'Destination URL' ),
		pos: __( 'Position' ),
	};

	const inserterCells = {
		src_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.src_url_name } onChange={ ( val ) => setInsertRow( { ...rowToInsert, src_url_name: val } ) } required />,
		dest_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.dest_url_name } onChange={ ( val ) => setInsertRow( { ...rowToInsert, dest_url_name: val } ) } required />,
		pos: <InputField liveUpdate type="number" defaultValue="0" min="0" max="255" label={ header.pos } onChange={ ( val ) => setInsertRow( { ...rowToInsert, pos: val } ) } required />,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: <SortBy props={ { sorting, key: 'src_url_name', onClick: () => sortBy( 'src_url_name' ) } }>{ header.src_url_name }</SortBy>,
			size: 400,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: <SortBy props={ { sorting, key: 'dest_url_name', onClick: () => sortBy( 'dest_url_name' ) } }>{ header.dest_url_name }</SortBy>,
			size: 400,
		} ),
		columnHelper.accessor( 'pos', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector: 'dest_url_id' } ) } />,
			header: <SortBy props={ { sorting, key: 'pos', onClick: () => sortBy( 'pos' ) } }>{ header.pos }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell, optionalSelector: 'dest_url_id' } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ () => deleteSelectedRows( 'dest_url_id' ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				onClearRow={ ( clear ) => {
					setInsertRow();
					if ( clear === 'rowInserted' ) {
						setInsertRow( clear );
						setTimeout( () => {
							setInsertRow();
						}, 3000 );
					}
				} }
				insertOptions={ { inserterCells, title: 'Add related article', data, slug, url, paginationId, rowToInsert } }
				exportOptions={ {
					slug,
					filters,
					fromId: `from_${ paginationId }`,
					paginationId,
					deleteCSVCols: [ paginationId, 'dest_url_id' ],
				} }
			/>

			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ __( 'Item has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToInsert === 'rowInserted' )
					? <Tooltip center>{ __( 'Item has been added.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
