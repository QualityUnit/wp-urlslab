import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, InputField, SingleSelectMenu, Trash, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, Edit, TagsMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import IconButton from '../elements/IconButton';

export default function RedirectsTable( { slug } ) {
	const paginationId = 'redirect_id';

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

	const { row, selectedRows, selectRow, rowToEdit, setEditorRow, activePanel, setActivePanel, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate defaultValue="" label={ header.match_url } onChange={ ( val ) => setEditorRow( { ...rowToEdit, match_url: val } ) } required />,
		replace_url: <InputField type="url" liveUpdate defaultValue="" label={ header.replace_url } onChange={ ( val ) => setEditorRow( { ...rowToEdit, replace_url: val } ) } required />,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301" onChange={ ( val ) => setEditorRow( { ...rowToEdit, redirect_code: val } ) }>{ header.redirect_code }</SingleSelectMenu>,
		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A" onChange={ ( val ) => setEditorRow( { ...rowToEdit, is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers } onChange={ ( val ) => setEditorRow( { ...rowToEdit, headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie } onChange={ ( val ) => setEditorRow( { ...rowToEdit, cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params } onChange={ ( val ) => setEditorRow( { ...rowToEdit, capabilities: val } ) } />,
		capabilities: <InputField liveUpdate defaultValue="" label={ header.capabilities } onChange={ ( val ) => setEditorRow( { ...rowToEdit, capabilities: val } ) } />,
		ip: <InputField liveUpdate defaultValue="" label={ header.ip } onChange={ ( val ) => setEditorRow( { ...rowToEdit, ip: val } ) } />,
		roles: <InputField liveUpdate defaultValue="" label={ header.roles } onChange={ ( val ) => setEditorRow( { ...rowToEdit, roles: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser } onChange={ ( val ) => setEditorRow( { ...rowToEdit, browser: val } ) } />,
		if_not_found: <SingleSelectMenu autoClose items={ notFoundTypes } name="if_not_found" defaultValue="A" onChange={ ( val ) => setEditorRow( { ...rowToEdit, if_not_found: val } ) }>{ header.if_not_found }</SingleSelectMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'match_type', {
			filterValMenu: matchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ matchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.match_type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.match_url }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'replace_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.replace_url }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'redirect_code', {
			filterValMenu: redirectTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ redirectTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.redirect_code }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			filterValMenu: notFoundTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ notFoundTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.if_not_found }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			filterValMenu: logginTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ logginTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.is_logged }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'capabilities', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.capabilities }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.ip }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'roles', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.roles }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'browser', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.browser }</SortBy>,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'cookie', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.cookie }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.headers }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.params }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'cnt', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.cnt }</SortBy>,
			size: 100,
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
					<div className="flex">
						<IconButton
							onClick={ () => {
								setActivePanel( 'rowEditor' );
								updateRow( { cell } );
							} }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Edit row' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell } ) }
							tooltipClass="align-left xxxl"
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
				slug={ slug }
				header={ header }
				table={ table }
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				onUpdateRow={ ( val ) => {
					setActivePanel();
					setEditorRow();
					if ( val === 'rowInserted' || val === 'rowChanged' ) {
						setActivePanel();
						setEditorRow( val );
						setTimeout( () => {
							setEditorRow();
						}, 3000 );
					}
				} }
				activatePanel={ activePanel }
				rowEditorOptions={ { rowEditorCells, title: 'Add New Redirect', data, slug, url, paginationId, rowToEdit } }
				exportOptions={ {
					slug,
					url,
					paginationId,
					deleteCSVCols: [ paginationId ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				initialState={ { columnVisibility: { roles: false, headers: false, params: false, capabilities: false, ip: false, if_not_found: false, browser: false, cookie: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.str_search } “${ row.str_search }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowChanged' )
					? <Tooltip center>{ __( 'Redirect rule has been changed.' ) }</Tooltip>
					: null
				}
				{ ( rowToEdit === 'rowInserted' )
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
