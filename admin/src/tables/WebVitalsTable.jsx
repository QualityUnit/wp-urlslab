import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, RowActionButtons, DateTimeFormat, TableSelectCheckbox,
} from '../lib/tableImports';

import { useQueryClient } from '@tanstack/react-query';
import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import { countriesList } from '../api/fetchCountries';
import { getMetricWithUnit } from '../lib/metricChartsHelpers';

import BrowserIcon from '../elements/BrowserIcon';
import DescriptionBox from '../elements/DescriptionBox';
import TreeView from '../elements/TreeView';

const paginationId = 'wv_id';

export const header = {
	event_id: __( 'Id', 'wp-urlslab' ),
	metric_type: __( 'Metric', 'wp-urlslab' ),
	nav_type: __( 'Navigation Type', 'wp-urlslab' ),
	rating: __( 'Rating', 'wp-urlslab' ),
	created: __( 'Created', 'wp-urlslab' ),
	value: __( 'Value', 'wp-urlslab' ),
	attribution: __( 'Attribution Data', 'wp-urlslab' ),
	element: __( 'DOM Element', 'wp-urlslab' ),
	entries: __( 'Entries', 'wp-urlslab' ),
	browser: __( 'Browser', 'wp-urlslab' ),
	ip: __( 'IP', 'wp-urlslab' ),
	url_name: __( 'URL', 'wp-urlslab' ),
	country: __( 'Country', 'wp-urlslab' ),
	post_type: __( 'Post Type', 'wp-urlslab' ),
};
const initialState = { columnVisibility: { nav_type: false, entries: false, event_id: false, attribution: false, country: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
			id: 'url',
		} );
	}, [ setTable, slug ] );

	return init && <WebVitalsTable slug={ slug } />;
}

function WebVitalsTable( { slug } ) {
	const queryClient = useQueryClient();
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const postTypesFromQuery = queryClient.getQueryData( [ 'postTypes' ] );

	const { deleteRow } = useChangeRow( );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'event_id', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'metric_type', {
			className: 'nolimit',
			tooltip: ( cell ) => columnTypes?.metric_type.values[ cell.getValue() ],
			cell: ( val ) => columnTypes?.metric_type.values[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'nav_type', {
			className: 'nolimit',
			cell: ( val ) => columnTypes?.nav_type.values[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'rating', {
			className: 'nolimit',
			cell: ( val ) => columnTypes?.rating.values[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			style: ( cell ) => {
				if ( cell?.row?.original.rating === 'g' ) {
					return { color: '#087208FF' };
				}
				return ( cell?.row?.original.rating === 'n' ? { color: '#FFA200FF' } : { color: '#FF0000' } );
			},
			minSize: 30,
		} ),
		columnHelper.accessor( 'created', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 130,
		} ),
		columnHelper.accessor( 'value', {
			cell: ( cell ) => getMetricWithUnit( cell.getValue(), cell.row.original.metric_type ),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'attribution', {
			className: 'nolimit',
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'entries', {
			className: 'nolimit',
			cell: ( cell ) => <TreeView sourceData={ cell.getValue() } isTableCellPopper />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'element', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'ip', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 150,
		} ),
		columnHelper.accessor( 'browser', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <BrowserIcon uaString={ cell.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'country', {
			tooltip: ( cell ) => countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue(),
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'post_type', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => postTypesFromQuery[ cell.getValue() ] ? postTypesFromQuery[ cell.getValue() ] : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, columnTypes, deleteRow, postTypesFromQuery ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table contains web vitals events measured by real users on your website. It will help you identify the HTML elements and pages that need improvement. Web vitals are among the most important signals for Google. It is crucial to monitor web vitals and promptly address any issues to maintain the best positions in search engines for your page.', 'wp-urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport noInsert />

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
				disableAddNewTableRecord
			>
				<TooltipSortingFiltering />
			</Table>

		</>
	);
}
