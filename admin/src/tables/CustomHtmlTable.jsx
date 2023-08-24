import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	SingleSelectMenu,
	InputField,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	TextArea,
	RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';

export default function CustomHtmlTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Custom HTML' );
	const paginationId = 'rule_id';

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

	const matchTypes = Object.freeze( {
		A: 'All pages',
		E: 'Exact match',
		S: 'Contains',
		R: 'Regexp',
	} );

	const logginTypes = Object.freeze( {
		Y: 'Only logged in users',
		N: 'Only not logged visitors',
		A: 'All users and visitors',
	} );

	const header = {
		name: __( 'Rule Name' ),
		labels: __( 'Tags' ),
		is_active: __( 'Active Rule' ),
	};

	const rowEditorCells = {
		name: <InputField liveUpdate type="text" defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } />,

		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E"
			description={ __( 'Select when should be applied the rule' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,

		match_url: <InputField type="url" autoFocus liveUpdate defaultValue="" label={ header.match_url } hidden={ rowToEdit?.match_type === 'A' }
			description={ __( 'Match browser URL with this value based on the selected type of rule' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } />,

		match_headers: <InputField liveUpdate defaultValue="" label={ header.match_headers }
			description={ __( 'If you need to inject custom HTML to page if request contains specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_headers: val } ) } />,

		match_cookie: <InputField liveUpdate defaultValue="" label={ header.match_cookie }
			description={ __( 'If you need to inject custom HTML to page for requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_cookie: val } ) } />,

		match_params: <InputField liveUpdate defaultValue="" label={ header.match_params }
			description={ __( 'If you need to inject custom HTML to page just if request has specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_params: val } ) } />,

		match_capabilities: <InputField liveUpdate defaultValue="" label={ header.match_capabilities }
			description={ __( 'If you need to inject custom HTML to page for user with special WordPress capability. Comma separated list of capabilities.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_capabilities: val } ) } />,

		match_ip: <InputField liveUpdate defaultValue="" label={ header.match_ip }
			description={ __( 'Inject Custom HTML just for users from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_ip: val } ) } />,

		match_roles: <InputField liveUpdate defaultValue="" label={ header.match_roles }
			description={ __( 'If you need to inject custom HTML to page just for user with special WordPress role. Comma separated list of roles.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_roles: val } ) } />,

		match_browser: <InputField liveUpdate defaultValue="" label={ header.match_browser }
			description={ __( 'If you need to inject custom HTML to page just for specific browser names. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_browser: val } ) } />,

		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A"
			description={ __( 'Apply rule just for users with selected login status.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_logged: val } ) }>{ header.is_logged }</SingleSelectMenu>,

		add_http_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_http_headers }
			description={ __( 'Add custom HTTP headers sent from server to browser. Separate headers by new lines, header name and value by `=`. (e.g. X-URLSLAB-HEADER=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_http_headers: val } ) } />,

		add_start_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_start_headers }
			description={ __( 'Value will be inserted right after <head> tag.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_start_headers: val } ) } />,

		add_end_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_end_headers }
			description={ __( 'Value will be inserted right before </head> tag.' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_end_headers: val } ) } />,

		add_start_body: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_start_body }
			description={ __( 'Value will be inserted right after <body> tag (beginning of html page).' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_start_body: val } ) } />,

		add_end_body: <TextArea rows="5" liveUpdate defaultValue="" label={ header.add_end_body }
			description={ __( 'Value will be inserted right before </body> tag (end of html page).' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_end_body: val } ) } />,

		rule_order: <InputField liveUpdate type="text" defaultValue="10" label={ header.rule_order } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, rule_order: val } ) } />,

		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_active: val } ) }>{ header.is_active }</Checkbox>,

		labels: <TagsMenu hasActivator label={ __( 'All tags for this row:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
				title,
				paginationId,
				slug,
				header,
				id: 'name',
			}
		) );

		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
	}, [ data ] );

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
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onEdit={ () => updateRow( { cell, id: 'name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'name' } ) }
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
