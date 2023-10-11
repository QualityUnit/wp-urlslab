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
import DescriptionBox from '../elements/DescriptionBox';

export default function CustomHtmlTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Custom Code' );
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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const matchTypes = Object.freeze( {
		A: 'All pages',
		E: 'Exact match',
		S: 'Contains',
		R: 'Regular expression',
	} );

	const logginTypes = Object.freeze( {
		Y: 'Logged in',
		N: 'Not logged in',
		A: 'Any',
	} );

	const header = {
		name: __( 'Rule name' ),
		is_active: __( 'Active rule' ),
		labels: __( 'Tags' ),

	};

	const editRowCells = {
		match_type: __( 'Match type' ),
		match_url: __( 'Match URL' ),
		rule_order: __( 'Order' ),
		match_headers: __( 'Request headers' ),
		match_cookie: __( 'Cookies' ),
		match_params: __( 'Request parameters' ),
		match_capabilities: __( 'Capabilities' ),
		match_ip: __( 'Visitor IP' ),
		match_roles: __( 'Roles' ),
		match_browser: __( 'Browser' ),
		is_logged: __( 'Is logged in' ),
		add_http_headers: __( 'Custom HTTP Headers' ),
		add_start_headers: __( 'After <head>' ),
		add_end_headers: __( 'Before </head>' ),
		add_start_body: __( 'After <body>`' ),
		add_end_body: __( 'Before `</body>`' ),
	};

	const rowEditorCells = {
		name: <InputField liveUpdate autoFocus type="text" defaultValue="" label={ header.name } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, name: val } ) } />,

		rule_order: <InputField liveUpdate type="number" defaultValue="10" label={ editRowCells.rule_order } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, rule_order: val } ) } />,

		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_active: val } ) }>{ header.is_active }</Checkbox>,

		labels: <TagsMenu hasActivator noOverflow label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,

		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="E"
			description={ __( 'Choose when the rule should be applied' ) }
			section="Match Pages"
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ editRowCells.match_type }</SingleSelectMenu>,

		match_url: <InputField type="url" liveUpdate defaultValue="" label={ editRowCells.match_url } hidden={ rowToEdit?.match_type === 'A' }
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } />,

		match_headers: <InputField liveUpdate defaultValue="" label={ editRowCells.match_headers }
			description={ __( 'Apply only for requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_headers: val } ) } />,

		match_cookie: <InputField liveUpdate defaultValue="" label={ editRowCells.match_cookie }
			description={ __( 'Apply only for requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_cookie: val } ) } />,

		match_params: <InputField liveUpdate defaultValue="" label={ editRowCells.match_params }
			description={ __( 'Apply only for requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_params: val } ) } />,

		match_capabilities: <InputField liveUpdate defaultValue="" label={ editRowCells.match_capabilities }
			description={ __( 'Apply only for requests from users with certain capabilities' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_capabilities: val } ) } />,

		match_ip: <InputField liveUpdate defaultValue="" label={ editRowCells.match_ip }
			description={ __( 'Apply only for visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_ip: val } ) } />,

		match_roles: <InputField liveUpdate defaultValue="" label={ editRowCells.match_roles }
			description={ __( 'Apply only for requests from users with particular roles' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_roles: val } ) } />,

		match_browser: <InputField liveUpdate defaultValue="" label={ editRowCells.match_browser }
			description={ __( 'Apply for visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_browser: val } ) } />,

		is_logged: <SingleSelectMenu autoClose items={ logginTypes } name="is_logged" defaultValue="A"
			description={ __( 'Apply only to users with a specific login status' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_logged: val } ) }>{ editRowCells.is_logged }</SingleSelectMenu>,

		add_http_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_http_headers }
			description={ __( 'Add custom HTTP headers transmitted from the server to the browser. Use new lines to separate headers. For instance: X-URLSLAB-HEADER=value' ) }
			section="Injected Code"
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_http_headers: val } ) } />,

		add_start_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_start_headers }
			description={ __( 'Custom HTML code inserted immediately after the opening `<head>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_start_headers: val } ) } />,

		add_end_headers: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_end_headers }
			description={ __( 'Custom HTML code inserted immediately before the closing `</head>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_end_headers: val } ) } />,

		add_start_body: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_start_body }
			description={ __( 'Custom HTML code inserted immediately after the opening `<body>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_start_body: val } ) } />,

		add_end_body: <TextArea rows="5" liveUpdate defaultValue="" label={ editRowCells.add_end_body }
			description={ __( 'Custom HTML code inserted immediately before the closing `</body>` tag, applicable to all pages' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, add_end_body: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId, 'dest_url_id' ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						data,
						title,
						paginationId,
						slug,
						header,
						id: 'name',
					},
				},
			}
		) );
	}, [ slug ] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'name', {
			className: 'nolimit',
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
				onEdit={ () => updateRow( { cell, id: 'name' } ) }
				onDelete={ () => deleteRow( { cell, id: 'name' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'Learn more...' ) } isMainTableDescription>
				{ __( "The table displays a list of code injection rules applied to the generated page. If the page matches the rule conditions, the HTML headers and content are augmented with the provided HTML, CSS or JS codes. With the option to define custom rules, you can create a variety of code injection combinations based on numerous condition types. To implement a specific code onto all pages of your website, navigate to the 'Settings' tab to establish an injection applicable to all pages." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
