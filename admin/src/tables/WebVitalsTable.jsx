import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, ProgressBar, SortBy, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, RowActionButtons, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

import BrowserIcon from '../elements/BrowserIcon';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'wv_id';
const defaultSorting = [ { key: 'wv_id', dir: 'DESC', op: '<' } ];

const header = {
	event_id: __( 'Id' ),
	metric_type: __( 'Metric' ),
	nav_type: __( 'Navigation Type' ),
	rating: __( 'Rating' ),
	created: __( 'Created' ),
	value: __( 'Value' ),
	attribution: __( 'Attribution Data' ),
	entries: __( 'Entries' ),
	visitor: __( 'Visitor' ),
};

const metric_types = {
	C: __( 'CLS' ),
	P: __( 'FCP' ),
	L: __( 'LCP' ),
	F: __( 'FID' ),
	I: __( 'INP' ),
	T: __( 'TTFB' ),
}

const navigation_types = {
	n: __( 'Navigation' ),
	r: __( 'Reload' ),
	b: __( 'Back/Forward' ),
	c: __( 'Back/Forward Cache' ),
	p: __( 'Prerender' ),
	s: __( 'Restore' ),
}
const rating_types = {
	g: __( 'Good' ),
	n: __( 'Needs Improvement' ),
	p: __( 'Poor' ),
}

export default function WebVitalsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						title: __( 'Create redirect' ),
						paginationId,
						slug,
						header,
						id: 'url',
						sorting: defaultSorting,
					},
				},
			}
		) );
	}, [ slug ] );

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
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'event_id', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'metric_type', {
			filterValMenu: metric_types,
			className: 'nolimit',
			tooltip: ( cell ) => metric_types[cell.getValue()],
			cell: ( val ) => metric_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'nav_type', {
			filterValMenu: navigation_types,
			className: 'nolimit',
			tooltip: ( cell ) => navigation_types[cell.getValue()],
			cell: ( val ) => navigation_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'rating', {
			filterValMenu: rating_types,
			className: 'nolimit',
			tooltip: ( cell ) => rating_types[cell.getValue()],
			cell: ( val ) => rating_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'created', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 80,
		} ),
		columnHelper.accessor( 'value', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'attribution', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'entries', {
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.visitor }` )?.referer, {
			id: 'referer',
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: __( 'Referer' ),
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.visitor }` )?.ip, {
			id: 'ip',
			cell: ( cell ) => {
				return cell.getValue();
			},
			header: header.ip,
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.visitor }` )?.agent, {
			id: 'agent',
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <BrowserIcon uaString={ cell.getValue() } />,
			header: __( 'User Agent' ),
			size: 100,
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
	], [ columnHelper, deleteRow, selectRows, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'Table contains web vitals events measured by real users on your website. It should help you to identify the html elements, which needs improvement. Web vitals are one of the most important signals for Google. It is important to monitor web vitals and immediately fix problems to keep your page in top 10 on Google.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { nav_type: false, entries: false, event_id: false } } }
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