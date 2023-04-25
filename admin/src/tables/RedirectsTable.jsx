import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, InputField, SortMenu, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';

export default function RedirectsTable( { slug } ) {
	const paginationId = 'redirect_id';

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

	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	const inserterCells = {
		match_type: <SortMenu defaultAccept autoClose items={ matchTypes } name="match_type" checkedId="E" onChange={ ( val ) => setInsertRow( { ...rowToInsert, match_type: val } ) }>{ header.match_type }</SortMenu>,
		match_url: <InputField type="url" liveUpdate defaultValue="" label={ header.match_url } onChange={ ( val ) => setInsertRow( { ...rowToInsert, match_url: val } ) } required />,
		replace_url: <InputField type="url" liveUpdate defaultValue="" label={ header.replace_url } onChange={ ( val ) => setInsertRow( { ...rowToInsert, replace_url: val } ) } required />,
		redirect_code: <SortMenu autoClose items={ redirectTypes } name="redirect_code" checkedId="301" onChange={ ( val ) => setInsertRow( { ...rowToInsert, redirect_code: val } ) }>{ header.redirect_code }</SortMenu>,
		is_logged: <SortMenu autoClose items={ logginTypes } name="is_logged" checkedId="A" onChange={ ( val ) => setInsertRow( { ...rowToInsert, is_logged: val } ) }>{ header.is_logged }</SortMenu>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers } onChange={ ( val ) => setInsertRow( { ...rowToInsert, headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie } onChange={ ( val ) => setInsertRow( { ...rowToInsert, cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params } onChange={ ( val ) => setInsertRow( { ...rowToInsert, capabilities: val } ) } />,
		capabilities: <InputField liveUpdate defaultValue="" label={ header.capabilities } onChange={ ( val ) => setInsertRow( { ...rowToInsert, capabilities: val } ) } />,
		ip: <InputField liveUpdate defaultValue="" label={ header.ip } onChange={ ( val ) => setInsertRow( { ...rowToInsert, ip: val } ) } />,
		roles: <InputField liveUpdate defaultValue="" label={ header.roles } onChange={ ( val ) => setInsertRow( { ...rowToInsert, roles: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser } onChange={ ( val ) => setInsertRow( { ...rowToInsert, browser: val } ) } />,
		if_not_found: <SortMenu autoClose items={ notFoundTypes } name="if_not_found" checkedId="A" onChange={ ( val ) => setInsertRow( { ...rowToInsert, if_not_found: val } ) }>{ header.if_not_found }</SortMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'match_type', {
			filterValMenu: matchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ matchTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'match_type', onClick: () => sortBy( 'match_type' ) } }>{ header.match_type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'match_url', onClick: () => sortBy( 'match_url' ) } }>{ header.match_url }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'replace_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'replace_url', onClick: () => sortBy( 'replace_url' ) } }>{ header.replace_url }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'redirect_code', {
			filterValMenu: redirectTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ redirectTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'redirect_code', onClick: () => sortBy( 'redirect_code' ) } }>{ header.redirect_code }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			filterValMenu: notFoundTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ notFoundTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'if_not_found', onClick: () => sortBy( 'if_not_found' ) } }>{ header.if_not_found }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			filterValMenu: logginTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu items={ logginTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'is_logged', onClick: () => sortBy( 'is_logged' ) } }>{ header.is_logged }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'capabilities', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'capabilities', onClick: () => sortBy( 'capabilities' ) } }>{ header.capabilities }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'ip', onClick: () => sortBy( 'ip' ) } }>{ header.ip }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'roles', {
			header: <SortBy props={ { sorting, key: 'roles', onClick: () => sortBy( 'roles' ) } }>{ header.roles }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'browser', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'browser', onClick: () => sortBy( 'browser' ) } }>{ header.browser }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'cookie', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'cookie', onClick: () => sortBy( 'cookie' ) } }>{ header.cookie }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'headers', onClick: () => sortBy( 'headers' ) } }>{ header.headers }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: <SortBy props={ { sorting, key: 'params', onClick: () => sortBy( 'params' ) } }>{ header.params }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'cnt', {
			header: <SortBy props={ { sorting, key: 'cnt', onClick: () => sortBy( 'cnt' ) } }>{ header.cnt }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: () => null,
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
				onDeleteSelected={ deleteSelectedRows }
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
				insertOptions={ { inserterCells, title: 'Add redirect', data, slug, url, paginationId, rowToInsert } }
				exportOptions={ {
					slug,
					filters,
					fromId: `from_${ paginationId }`,
					paginationId,
					deleteCSVCols: [ paginationId ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				initialState={ { columnVisibility: { is_logged: false, header: false, params: false, capabilities: false, ip: false, if_not_found: false, browser: false, cookie: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToInsert === 'rowInserted' )
					? <Tooltip center>{ __( 'Redirect rule has been added.' ) }</Tooltip>
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
