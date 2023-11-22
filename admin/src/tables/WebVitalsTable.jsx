import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, RowActionButtons, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';

import BrowserIcon from '../elements/BrowserIcon';
import DescriptionBox from '../elements/DescriptionBox';
import { countriesList, countriesListForSelect } from '../api/fetchCountries';

const paginationId = 'wv_id';

const header = {
	event_id: __( 'Id' ),
	metric_type: __( 'Metric' ),
	nav_type: __( 'Navigation Type' ),
	rating: __( 'Rating' ),
	created: __( 'Created' ),
	value: __( 'Value' ),
	attribution: __( 'Attribution Data' ),
	element: __( 'DOM Element' ),
	entries: __( 'Entries' ),
	browser: __( 'Browser' ),
	ip: __( 'IP' ),
	url_name: __( 'URL' ),
	country: __( 'Country' ),
};

const metric_types = {
	C: 'CLS',
	P: 'FCP',
	L: 'LCP',
	F: 'FID',
	I: 'INP',
	T: 'TTFB',
};

const metric_typesNames = {
	C: __( 'Cumulative Layout Shift (CLS)' ),
	P: __( 'First Contentful Paint (FCP)' ),
	L: __( 'Largest Contentful Paint (LCP)' ),
	F: __( 'First Input Delay (FID)' ),
	I: __( 'Interaction to Next Paint (INP)' ),
	T: __( 'Time to First Byte (TTFB)' ),
};

const navigation_types = {
	n: __( 'Navigation' ),
	r: __( 'Reload' ),
	b: __( 'Back/Forward' ),
	c: __( 'Back/Forward Cache' ),
	p: __( 'Prerender' ),
	s: __( 'Restore' ),
};
const rating_types = {
	g: __( 'Good' ),
	n: __( 'Needs Improvement' ),
	p: __( 'Poor' ),
};

export default function WebVitalsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow( );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
						id: 'url',
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
			filterValMenu: metric_typesNames,
			className: 'nolimit',
			tooltip: ( cell ) => metric_typesNames[ cell.getValue() ],
			cell: ( val ) => metric_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'nav_type', {
			filterValMenu: navigation_types,
			className: 'nolimit',
			tooltip: ( cell ) => navigation_types[ cell.getValue() ],
			cell: ( val ) => navigation_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			minSize: 30,
		} ),
		columnHelper.accessor( 'rating', {
			filterValMenu: rating_types,
			className: 'nolimit',
			tooltip: ( cell ) => rating_types[ cell.getValue() ],
			cell: ( val ) => rating_types[ val.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			style: ( cell ) => ( cell?.row?.original.rating === 'g' ? { color: '#087208FF' } : ( cell?.row?.original.rating === 'n' ? { color: '#FFA200FF' } : { color: '#FF0000' } ) ),
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
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'entries', {
			header: ( th ) => <SortBy { ...th } />,
			tooltip: ( cell ) => cell.getValue(),
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
			filterValMenu: countriesListForSelect,
			tooltip: ( cell ) => countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue(),
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
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
				{ __( 'The table contains web vitals events measured by real users on your website. It will help you identify the HTML elements and pages that need improvement. Web vitals are among the most important signals for Google. It is crucial to monitor web vitals and promptly address any issues to maintain the best positions in search engines for your page.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { nav_type: false, entries: false, event_id: false, attribution: false, country: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
