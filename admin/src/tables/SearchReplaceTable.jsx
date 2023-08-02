import {
	useInfiniteFetch, ProgressBar, SortBy, SingleSelectMenu, InputField, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, Edit, IconButton,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
// import { active } from 'd3';

export default function SearchReplaceTable( { slug } ) {
	const paginationId = 'id';

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

	const { activatePanel, setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const searchTypes = {
		T: __( 'Plain text' ),
		R: __( 'Regular expression' ),
	};

	const loginStatuses = {
		A: __( 'All' ),
		L: __( 'Logged in only' ),
		O: __( 'Anonym visitors only' ),
	};

	const header = {
		str_search: __( 'Search string (old)' ),
		str_replace: __( 'Replace string (new)' ),
		search_type: __( 'Search type' ),
		login_status: __( 'Login status' ),
		labels: __( 'Tags' ),
		url_filter: 'URL filter',
	};

	const rowEditorCells = {
		search_type: <SingleSelectMenu defaultAccept autoClose items={ searchTypes } name="search_type" defaultValue="T"
			description={ __( 'Choose how will be matched string in the HTML page. Possible options is exact match and regular expression.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, search_type: val } ) }>{ header.search_type }</SingleSelectMenu>,

		str_search: <InputField liveUpdate type="url" defaultValue="" label={ header.str_search }
			description={ __( 'Input string or regular expression to replace in the HTML' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, str_search: val } ) } required />,

		str_replace: <InputField liveUpdate type="url" defaultValue="" label={ header.str_replace }
			description={ __( 'Value will replace match string' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, str_replace: val } ) } required />,

		url_filter: <InputField liveUpdate defaultValue=".*" label={ header.url_filter }
			description={ __( 'Regullar expression to match browser URL of page, where should be replacement applied. To replace text in all pages, use value `.*`' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, url_filter: val } ) } />,

		login_status: <SingleSelectMenu defaultAccept autoClose items={ loginStatuses } name="login_status" defaultValue="A"
			description={ __( 'Apply rule based on the login status of visitor or user' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, login_status: val } ) }>{ header.login_status }</SingleSelectMenu>,

		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
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
		columnHelper.accessor( 'str_search', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.str_search }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'str_replace', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.str_replace }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'search_type', {
			filterValMenu: searchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ searchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.search_type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'login_status', {
			filterValMenu: loginStatuses,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ loginStatuses } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.login_status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'url_filter', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_filter }</SortBy>,
			size: 150,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex editRow-buttons">
						<IconButton
							onClick={ () => {
								updateRow( { cell, id: 'str_search' } );
								activatePanel( 'rowEditor' );
							} }
							tooltipClass="align-left"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell, id: 'str_search' } ) }
							tooltipClass="align-left"
							tooltip={ __( 'Delete row' ) }
						>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: () => null,
			size: 60,
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
				options={ { header, rowEditorCells, title: 'Add New Replacement', data, slug, url, paginationId, rowToEdit, id: 'str_search', deleteCSVCols: [ paginationId, 'dest_url_id' ] } }
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
