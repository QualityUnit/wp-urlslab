import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, InputField, SingleSelectMenu, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, SuggestInputField, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';

export default function RedirectsTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Redirect' );
	const paginationId = 'redirect_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { setRowToEdit } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" autoFocus liveUpdate defaultValue="" label={ header.match_url }
			description={ __( 'Match browser URL with this value based on the selected type of rule' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } required />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' } showInputAsSuggestion={ true } liveUpdate defaultValue={ window.location.origin }
			description={ __( 'Redirect user to this URL if browser URL matched and also match all other conditions' ) }
			label={ header.replace_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, replace_url: val } ) } required />,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301"
			description={ __( 'HTTP Status code to use when redirecting visitor' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, redirect_code: val } ) }>{ header.redirect_code }</SingleSelectMenu>,
		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers }
			description={ __( 'Redirect only requests with specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie }
			description={ __( 'Redirect only requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params }
			description={ __( 'Redirect only requests with specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, params: val } ) } />,
		capabilities: <InputField liveUpdate defaultValue="" label={ header.capabilities }
			description={ __( 'Redirect only requests of users with specific capabilities. Match on of the capabilities from comma separated list.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, capabilities: val } ) } />,
		ip: <InputField liveUpdate defaultValue="" label={ header.ip }
			description={ __( 'Redirect just visitors from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, ip: val } ) } />,
		roles: <InputField liveUpdate defaultValue="" label={ header.roles }
			description={ __( 'Redirect only requests of users with specific role. Match on of the roles from comma separated list.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, roles: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser }
			description={ __( 'Redirect just visitors with specific browser. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, browser: val } ) } />,
		if_not_found: <SingleSelectMenu autoClose items={ notFoundTypes } name="if_not_found" defaultValue="A" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, if_not_found: val } ) }>{ header.if_not_found }</SingleSelectMenu>,
		labels: <TagsMenu hasActivator label={ __( 'All tags for this row:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				optionalSelector: undefined,
				slug,
				header,
				id: 'match_url',
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ data ] );

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
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'replace_url', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'redirect_code', {
			filterValMenu: redirectTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ redirectTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			filterValMenu: notFoundTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ notFoundTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			filterValMenu: logginTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ logginTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'capabilities', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'roles', {
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'browser', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
		} ),
		columnHelper.accessor( 'cookie', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'headers', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'params', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'cnt', {
			header: ( th ) => <SortBy { ...th } />,
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
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { roles: false, headers: false, params: false, capabilities: false, ip: false, if_not_found: false, browser: false, cookie: false } } }
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
