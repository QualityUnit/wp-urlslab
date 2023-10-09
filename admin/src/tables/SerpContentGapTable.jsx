/* eslint-disable indent */
import { useEffect, useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import GapDetailPanel from '../components/detailsPanel/GapDetailPanel';
import useTablePanels from '../hooks/useTablePanels';

export default function SerpContentGapTable( { slug } ) {
	const { __ } = useI18n();
	const title = __( 'Add Query' );
	const paginationId = 'query_id';
	const optionalSelector = 'country';

	const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const header = useMemo( () => {
		let headerObj = {
			query: __( 'Query' ),
			country: __( 'Country' ),
			comp_intersections: __( 'Competitors' ),
			internal_links: __( 'Internal Links' ),
		};

		Object.keys( fetchOptions ).map( ( fetchOptKey ) => {
			if ( fetchOptKey === 'domains' || fetchOptKey === 'urls' ) {
				Object.keys( fetchOptKey ).map( ( key ) => {
					const keyIndex = key.replace( /^.+?_(\d+)$/i, '$1' );
					console.log( keyIndex );
					return headerObj = { ...headerObj, [ `position_${ keyIndex }` ]: `SEO Ranking ${ keyIndex }`, [ `url_name_${ keyIndex }` ]: `URL Name ${ keyIndex }` };
				} );
			}
			return false;
		} );
		return headerObj;
	}, [ fetchOptions, __ ] );

	// console.log( fetchOptions );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						title,
						paginationId,
						optionalSelector,
						slug,
						header,
						id: 'query',
						sorting: defaultSorting,
					},
				},
			}
		) );
	}, [ slug ] );

	//Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item">{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
		} ),
		columnHelper.accessor( 'country', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'internal_links', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),

		//TODO dynamic columns based on selected domains or URLs
		columnHelper.accessor( 'position_0', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'url_name_0', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'position_1', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'url_name_1', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noInsert
				customPanel={ <GapDetailPanel slug={ slug } /> }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false, labels: false } } }
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
