import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function URLRelationTable( { slug } ) {
	const paginationId = 'src_url_id';
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

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const header = {
		src_url_name: __( 'Source URL' ),
		dest_url_name: __( 'Destination URL' ),
		pos: __( 'Position' ),
	};

	const rowEditorCells = {
		src_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.src_url_name } onChange={ ( val ) => setEditorRow( { ...rowToEdit, src_url_name: val } ) } required />,
		dest_url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.dest_url_name } onChange={ ( val ) => setEditorRow( { ...rowToEdit, dest_url_name: val } ) } required />,
		pos: <InputField liveUpdate type="number" defaultValue="0" min="0" max="255" label={ header.pos } onChange={ ( val ) => setEditorRow( { ...rowToEdit, pos: val } ) } required />,
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
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.src_url_name }</SortBy>,
			size: 400,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.dest_url_name }</SortBy>,
			size: 400,
		} ),
		columnHelper.accessor( 'pos', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector: 'dest_url_id' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.pos }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
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
				onDeleteSelected={ () => deleteSelectedRows( 'dest_url_id' ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				onUpdateRow={ ( val ) => {
					setEditorRow();
					if ( val === 'rowInserted' ) {
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				rowEditorOptions={ { rowEditorCells, title: 'Add related article', data, slug, url, paginationId, rowToEdit } }
				exportOptions={ {
					slug,
					url,
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
				{ ( rowToEdit === 'rowInserted' )
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
