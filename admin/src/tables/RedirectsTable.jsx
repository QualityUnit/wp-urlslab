import { memo, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch,
	SortBy,
	Checkbox,
	InputField,
	SingleSelectMenu,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	SuggestInputField,
	RowActionButtons,
	DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useRedirectTableMenus from '../hooks/useRedirectTableMenus';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import RolesMenu from '../elements/RolesMenu';
import CapabilitiesMenu from '../elements/CapabilitiesMenu';

const title = __( 'Add New Redirect' );
const paginationId = 'redirect_id';

export default function RedirectsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();
	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title,
						paginationId,
						slug,
						header,
						id: 'match_url',
					},
				},
			}
		) );
	}, [ header, slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'match_type', {
			filterValMenu: matchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ matchTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
			cell: ( cell ) => <SingleSelectMenu autoClose items={ redirectTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'if_not_found', {
			filterValMenu: notFoundTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ notFoundTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'is_logged', {
			filterValMenu: logginTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ logginTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
		columnHelper.accessor( 'created', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
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
	], [ columnHelper, deleteRow, header.labels, isSelected, logginTypes, matchTypes, notFoundTypes, redirectTypes, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table contains redirect rules that automatically guide visitors to your website when the outlined conditions are detected. These rules simplify the management of redirects, eliminating the need to manually alter the .htaccess file on your server. Redirect evaluations occur in PHP each time a visitor accesses a page. Importantly, our system does not modify your .htaccess file when changing rules.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { if_not_found: false, is_logged: false, capabilities: false, ip: false, roles: false, browser: false, cookie: false, headers: false, params: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
			<TableEditorManager slug={ slug } />
		</>
	);
}

const TableEditorManager = memo( ( { slug } ) => {
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const { redirectTypes, matchTypes, logginTypes, notFoundTypes, header } = useRedirectTableMenus();

	const rowEditorCells = useMemo( () => ( {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E" onChange={ ( val ) => setRowToEdit( { match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" autoFocus liveUpdate defaultValue="" label={ header.match_url }
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			onChange={ ( val ) => setRowToEdit( { match_url: val } ) } required />,
		replace_url: <SuggestInputField suggestInput={ rowToEdit?.match_url || '' } showInputAsSuggestion={ true } liveUpdate defaultValue={ window.location.origin }
			referenceVal="match_url"
			description={ __( 'If the browser URL and all other conditions match, redirect the user to this URL' ) }
			label={ header.replace_url } onChange={ ( val ) => setRowToEdit( { replace_url: val } ) } required />,
		redirect_code: <SingleSelectMenu autoClose items={ redirectTypes } name="redirect_code" defaultValue="301"
			description={ __( 'HTTP status code for visitor redirection' ) }
			onChange={ ( val ) => setRowToEdit( { redirect_code: val } ) }>{ header.redirect_code }</SingleSelectMenu>,
		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A" onChange={ ( val ) => setRowToEdit( { is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,
		headers: <InputField liveUpdate defaultValue="" label={ header.headers }
			description={ __( 'Redirect only requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { headers: val } ) } />,
		cookie: <InputField liveUpdate defaultValue="" label={ header.cookie }
			description={ __( 'Redirect only requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { cookie: val } ) } />,
		params: <InputField liveUpdate defaultValue="" label={ header.params }
			description={ __( 'Redirect only requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { params: val } ) } />,
		roles: <RolesMenu defaultValue="" description={ __( 'Redirect only requests from users with particular roles' ) }
			onChange={ ( val ) => setRowToEdit( { roles: val } ) } />,
		capabilities: <CapabilitiesMenu role={ rowToEdit.roles } defaultValue=""
			description={ __( 'Redirect only requests from users with certain capabilities' ) }
			onChange={ ( val ) => setRowToEdit( { capabilities: val } ) } />,
		ip: <InputField liveUpdate defaultValue="" label={ header.ip }
			description={ __( 'Redirect only visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { ip: val } ) } />,
		browser: <InputField liveUpdate defaultValue="" label={ header.browser }
			description={ __( 'Redirect visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { browser: val } ) } />,
		if_not_found: <SingleSelectMenu autoClose items={ notFoundTypes } name="if_not_found" defaultValue="A" onChange={ ( val ) => setRowToEdit( { if_not_found: val } ) }>{ header.if_not_found }</SingleSelectMenu>,
		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { labels: val } ) } />,

	} ), [ rowToEdit?.match_url, rowToEdit?.roles, header, logginTypes, setRowToEdit, redirectTypes, matchTypes, notFoundTypes, slug ] );

	useEffect( () => {
		useTablePanels.setState( ( ) => (
			{
				...useTablePanels.getState(),
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
	}, [ rowEditorCells ] );
} );
