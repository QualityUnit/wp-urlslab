import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	InputField,
	Checkbox,
	Trash,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	Tooltip,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
// import IconButton from '../elements/IconButton';
// import { active } from 'd3';

export default function FaqUrlsTable( { slug } ) {
	const paginationId = 'faq_id';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const defaultSorting = sorting.length ? sorting : [ { key: 'url_name', dir: 'ASC', op: '>' }, { key: 'sorting', dir: 'ASC', op: '>' } ];

	const url = { filters, sorting: defaultSorting };

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
	} = useInfiniteFetch( { key: slug, filters, sorting: defaultSorting, paginationId } );

	const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const header = {
		faq_id: __( 'Question ID' ),
		url_name: __( 'URL' ),
		question: __( 'Question' ),
		sorting: __( 'SEO Rank' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url_name', {
			className: 'nolimit',
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'faq_id', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.faq_id }</SortBy>,
			size: 20,
		} ),
		columnHelper.accessor( 'question', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.question }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'sorting', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100"
				onChange={ ( newVal ) => updateRow( { newVal, cell, optionalSelector: 'url_id' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.sorting }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell, optionalSelector: 'url_id', id: 'faq_id' } ) } />,
			header: null,
		} ),
	];

	const rowEditorCells = {
		url_name: <InputField liveUpdate type="url" defaultValue="" label={ header.url_name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_name: val } ) } required />,
		faq_id: <InputField liveUpdate defaultValue="" label={ header.faq_id } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, faq_id: val } ) } required />,
		sorting: <InputField liveUpdate type="number" defaultValue="10" label={ header.sorting } min="0" max="100"
			description={ __( 'Order of the FAQ in the list (Number 0 - 100).' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, sorting: val } ) } required />,
	};

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				selectedRows={ selectedRows }
				onDeleteSelected={ () => deleteSelectedRows( { optionalSelector: 'url_id', id: 'faq_id' } ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				initialState={ { columnVisibility: { sorting: true, faq_id: false, url_name: true, question: true } } }
				options={ { header, rowEditorCells, title: 'Add New FAQ to URL', data, slug, url, paginationId, rowToEdit, id: 'faq_id', deleteCSVCols: [ 'url_id' ] } }
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
