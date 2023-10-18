import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, InputField, SingleSelectMenu, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import { useEffect } from 'react';
import DescriptionBox from '../elements/DescriptionBox';

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

	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const matchTypes = Object.freeze( {
		A: 'All pages',
		E: 'Exact match',
		S: 'Contains',
		R: 'Regular expression',
	} );

	const header = Object.freeze( {
		match_type: __( 'Match type' ),
		match_url: __( 'Match URL' ),
		ip: __( 'Visitor IP' ),
		browser: __( 'Browser' ),
		cookie: __( 'Cookies' ),
		headers: __( 'Request headers' ),
		params: __( 'Request parameters' ),
		rule_order: __( 'Order' ),
		cache_ttl: __( 'Cache validity' ),
		is_active: __( 'Is active' ),
		labels: __( 'Tags' ),
	} );

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="A"
			description={ __( 'Choose when the rule should be applied' ) }
			onChange={ ( val ) => {
				setRowToEdit( { ...rowToEdit, match_type: val } );
				useTablePanels.setState( {
					rowEditorCells: {
						...rowEditorCells, match_url: { ...rowEditorCells.match_url, props: { ...rowEditorCells.match_url.props, disabled: val !== 'A' ? false : true, required: val !== 'A' ? true : false } } },
				} );
			}
			}
		>{ header.match_type }</SingleSelectMenu>,
		match_url: <InputField type="url" liveUpdate
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			label={ header.match_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } disabled={ true } required={ false } />,
		cache_ttl: <InputField liveUpdate defaultValue="3600" label={ header.cache_ttl }
			description={ __( 'Cache will remain valid for the specified duration in seconds. The same value will be utilized for cache headers dispatched to the browser' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cache_ttl: val } ) } />,

		headers: <InputField liveUpdate label={ header.headers } defaultValue=""
			description={ __( 'Apply only for requests with specified HTTP headers sent from the browser. List the headers to be checked, separated by commas. For instance: HEADER-NAME, HEADER-NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, headers: val } ) } />,

		cookie: <InputField liveUpdate label={ header.cookie } defaultValue=""
			description={ __( 'Apply only for requests with specified cookie sent from the browser. List the cookies to be checked, separated by commas. For instance: COOKIE_NAME, COOKIE_NAME=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, cookie: val } ) } />,

		params: <InputField liveUpdate label={ header.params } defaultValue=""
			description={ __( 'Apply only for requests with specified GET or POST parameter. List the parameters to be checked, separated by commas. For instance: query-param, query-param=value' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, params: val } ) } />,

		ip: <InputField liveUpdate label={ header.ip } defaultValue=""
			description={ __( 'Apply only for visitors from certain IP addresses or subnets. Provide a comma-separated list of IP addresses or subnets. For instance: 172.120.0.*, 192.168.0.0/24' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, ip: val } ) } />,

		browser: <InputField liveUpdate label={ header.browser } defaultValue=""
			description={ __( 'Apply for visitors using specific browsers. Input browser names or any string from User-Agent, separated by commas' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, browser: val } ) } />,

		rule_order: <InputField liveUpdate defaultValue="10" label={ header.rule_order } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, rule_order: val } ) } />,

		is_active: <Checkbox defaultValue={ true } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, is_active: val } ) }>{ header.is_active }</Checkbox>,

		labels: <TagsMenu optionItem label={ __( 'Tags:' ) } slug={ slug } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, labels: val } ) } />,
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				rowEditorCells,
				deleteCSVCols: [ paginationId ],
			}
		) );
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
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'match_type', {
			filterValMenu: matchTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ matchTypes } name={ cell.column.id } autoClose defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'match_url', {
			className: 'nolimit',
			cell: ( cell ) => cell.row.original.match_type !== 'A' ? <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } /> : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
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
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'cache_ttl', {
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
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
				onEdit={ () => updateRow( { cell } ) }
				onDelete={ () => deleteRow( { cell } ) }
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
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "Override the default caching behaviour set in the 'Settings' tab. These customizable rules enable you to fully manage the caching headers in your WordPress installation. You have the flexibility to establish varying cache validity across different parts of your website, adjust the values for each file type and even alter caching based on specific cookie or HTTP header parameters. It's important to set the right order for these rules (refer to 'Order' column) as the first rule that meets the condition will be implemented on the page, making subsequent rules redundant. Broad conditions should be placed at the end of the list while specific ones should be positioned at the top for effective rule enforcement." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				initialState={ { columnVisibility: { ip: false, browser: false, cookie: false, headers: false, params: false } } }
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
