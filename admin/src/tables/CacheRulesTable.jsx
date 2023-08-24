import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, InputField, SingleSelectMenu, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function CacheRulesTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add New Cache Rule' );
	const paginationId = 'rule_id';

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

	const { setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const setUnifiedPanel = ( cell ) => {
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell } );
	};

	const matchTypes = Object.freeze( {
		A: 'All pages',
		E: 'Exact match',
		S: 'Contains',
		R: 'Regular expression',
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
		cache_ttl: __( 'Cache validity' ),
		valid_from: __( 'Cache valid from' ),
		labels: __( 'Tags' ),
	} );

	const rowEditorCells = {
		match_type: <SingleSelectMenu defaultAccept autoClose items={ matchTypes } name="match_type" defaultValue="A"
			description={ __( 'Choose when the rule should be applied' ) }
			onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_type: val } ) }>{ header.match_type }</SingleSelectMenu>,

		match_url: <InputField type="url" hidden={ rowToEdit?.match_type === 'A' } liveUpdate defaultValue=""
			description={ __( 'Match this value with the browser URL according to the selected rule type' ) }
			label={ header.match_url } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, match_url: val } ) } required />,

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
		columnHelper.accessor( 'ip', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.ip }</SortBy>,
			size: 100,
			show: false,
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
		columnHelper.accessor( 'rule_order', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.rule_order }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'cache_ttl', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.cache_ttl }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'is_active', {
			className: 'nolimit',
			cell: ( cell ) => <Checkbox defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.is_active }</SortBy>,
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
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ deleteMultipleRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ {
					header, rowEditorCells, title, data, slug, url, paginationId, rowToEdit, deleteCSVCols: [ paginationId ] } }
			/>
			<Table className="fadeInto"
				title={ title }
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				initialState={ { columnVisibility: { headers: false, params: false, ip: false, browser: false, cookie: false } } }
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
