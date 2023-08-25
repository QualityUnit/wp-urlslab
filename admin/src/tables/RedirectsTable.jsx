import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, InputField, SingleSelectMenu, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';

export default function RedirectsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Redirect' );
	const paginationId = 'redirect_id';

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

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" autoFocus liveUpdate defaultValue="" label={ header.match_url }
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } required />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' } showInputAsSuggestion={ true } liveUpdate defaultValue={ window.location.origin }
			description={ __( 'If the browser URL and all other conditions match, redirect the user to this URL' ) }
			label={ header.replace_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, replace_url: val } ) } required />,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301"
			description={ __( 'HTTP status code for visitor redirection' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, redirect_code: val } ) }>{ header.redirect_code }</SingleSelectMenu>,
		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers }
			description={ __( 'Redirect only requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie }
			description={ __( 'Redirect only requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params }
			description={ __( 'Redirect only requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, params: val } ) } />,
		capabilities: <InputField liveUpdate defaultValue="" label={ header.capabilities }
			description={ __( 'Redirect only requests from users with certain capabilities' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, capabilities: val } ) } />,
		ip: <InputField liveUpdate defaultValue="" label={ header.ip }
			description={ __( 'Redirect only visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, ip: val } ) } />,
		roles: <InputField liveUpdate defaultValue="" label={ header.roles }
			description={ __( 'Redirect only requests from users with particular roles' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, roles: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser }
			description={ __( 'Redirect visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, browser: val } ) } />,
		if_not_found: <SingleSelectMenu autoClose items={ notFoundTypes } name="if_not_found" defaultValue="A" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, if_not_found: val } ) }>{ header.if_not_found }</SingleSelectMenu>,
		labels: <TagsMenu hasActivator label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
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
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'match_url' } ) }
				onDelete={ () => deleteRow( { cell, id: 'match_url' } ) }
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
				options={ {
					header,
					rowEditorCells, title, data, slug, url, paginationId, rowToEdit, id: 'match_url', deleteCSVCols: [ paginationId ] } }
			/>
			<Table className="fadeInto"
				title={ title }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				initialState={ { columnVisibility: { roles: false, headers: false, params: false, capabilities: false, ip: false, if_not_found: false, browser: false, cookie: false } } }
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
