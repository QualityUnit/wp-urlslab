import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, InputField, SingleSelectMenu, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import { useEffect } from 'react';

export default function CacheRulesTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Cache Rule' );
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

	const { setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setUnifiedPanel = ( cell ) => {
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );
	};

	const matchTypes = Object.freeze( {
		A: 'All Pages',
		E: 'Exact match',
		S: 'Contains',
		R: 'Regexp',
	} );

	const header = Object.freeze( {
		match_type: __( 'Match type' ),
		match_url: __( 'Match URL' ),
		is_active: __( 'Is active' ),
		ip: __( 'Visitor IP' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		rule_order: __( 'Order' ),
		cache_ttl: __( 'Cache Validity' ),
		valid_from: __( 'Cache Valid From' ),
		labels: __( 'Tags' ),
	} );

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="A"
			description={ __( 'Select when should be applied the rule' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,

		match_url: <InputField type="url" hidden={ rowToEdit?.match_type === 'A' } liveUpdate defaultValue=""
			description={ __( 'Match browser URL with this value based on the selected type of rule' ) }
			label={ header.match_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } required />,

		cache_ttl: <InputField liveUpdate defaultValue="3600" label={ header.cache_ttl }
			description={ __( 'Cache will be valid defined number of seconds (time to live). Same value will be used for cache headers sent to browser' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cache_ttl: val } ) } />,

		headers: <InputField liveUpdate label={ header.headers } defaultValue=""
			description={ __( 'Use only if you need to cache page just for requests with specific HTTP header sent from browser. Comma separated list of headers to check. (Example 1: check if any header exists: MY-HEADER-NAME1, HEADER2), (Example 2: check if header has specific value: MY-HEADER-NAME1=value1, HEADER2=value2)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, headers: val } ) } />,

		cookie: <InputField liveUpdate label={ header.cookie } defaultValue=""
			description={ __( 'Use only if you need to cache page just for requests with specific Cookie sent from browser. Comma separated list of cookies to check. (Example 1: check if any cookie exists: COOKIE_NAME_1, COOKIE_NAME_2), (Example 2: check if cookie has specific value: COOKIE-NAME=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cookie: val } ) } />,

		params: <InputField liveUpdate label={ header.params } defaultValue=""
			description={ __( 'Use only if you need to cache page just for requests with specific GET or POST parameter. Comma separated list of parameters to check. (Example 1: check if any parameter exists: query_param1, post_param_name2), (Example 2: check if request parameter has specific value: param1=value)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, params: val } ) } />,

		ip: <InputField liveUpdate label={ header.ip } defaultValue=""
			description={ __( 'Cache just requests from specific IP address or subnet. Comma separated list of IP addresses or subnets. (e.g., 172.120.0.*, 192.168.0.0/24)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, ip: val } ) } />,

		browser: <InputField liveUpdate label={ header.browser } defaultValue=""
			description={ __( 'Cache just requests from specific browser names. Comma separated list of browser names or any string from User-Agent. (e.g. Chrome, Safari)' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, browser: val } ) } />,

		rule_order: <InputField liveUpdate defaultValue="10" label={ header.rule_order } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, rule_order: val } ) } />,

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
				optionalSelector: undefined,
				slug,
				header,
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
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
			show: false,
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
		columnHelper.accessor( 'rule_order', {
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'cache_ttl', {
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
				onEdit={ () => setUnifiedPanel( cell ) }
				onDelete={ () => deleteRow( { cell } ) }
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
				initialState={ { columnVisibility: { headers: false, params: false, ip: false, browser: false, cookie: false } } }
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
