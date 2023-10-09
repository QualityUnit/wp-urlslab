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

	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const columnsDef = useMemo( () => {
		let header = {
			query: __( 'Query' ),
			country: __( 'Country' ),
			comp_intersections: __( 'Competitors' ),
			internal_links: __( 'Internal Links' ),
		};

		let columns = [
			columnHelper.accessor( 'query', {
				tooltip: ( cell ) => cell.getValue(),
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
				cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => setFetchOptions( { ...useTablePanels.getState().fetchOptions, query: cell.getValue(), queryFromClick: cell.getValue() } ) }>{ cell.getValue() }</strong>,
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
		];

		if ( fetchOptions ) {
			Object.keys( fetchOptions ).map( ( fetchOptKey ) => {
			if ( fetchOptKey === 'domains' || fetchOptKey === 'urls' ) {
				Object.values( fetchOptions[ fetchOptKey ] ).map( ( value, index ) => {
					if ( value ) {
						header = { ...header, [ `position_${ index }` ]: `SEO Ranking ${ index }`, [ `url_name_${ index }` ]: value };

						columns = [ ...columns,
						columnHelper.accessor( `position_${ index }`, {
							className: 'nolimit',
							cell: ( cell ) => cell.getValue(),
							header: ( th ) => <SortBy { ...th } />,
							size: 50,
						} ),
						columnHelper.accessor( `url_name_${ index }`, {
							tooltip: ( cell ) => cell.getValue(),
							cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
							header: ( th ) => <SortBy { ...th } />,
							size: 150,
						} ),
						];
					}
					return false;
				} );
			}
			return false;
		} );
	}

		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						header,
					},
				},
			}
		) );

		return { header, columns };
	}, [ setFetchOptions, slug, fetchOptions, columnHelper, __ ] );

	const { columns } = columnsDef;

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

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noInsert
				noCount
				customPanel={ <GapDetailPanel slug={ slug } /> }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
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
