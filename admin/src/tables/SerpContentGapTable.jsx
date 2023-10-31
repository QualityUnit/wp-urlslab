/* eslint-disable indent */
import { useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import useChangeRow from '../hooks/useChangeRow';

import hexToHSL from '../lib/hexToHSL';
import GapDetailPanel from '../components/detailsPanel/GapDetailPanel';

const paginationId = 'query_id';
const optionalSelector = '';
const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

export default function SerpContentGapTable( { slug } ) {
	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );

	const { updateRow } = useChangeRow( { defaultSorting } );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting, wait: ! fetchOptions?.urls?.length } );

	const colorRanking = useCallback( ( val ) => {
		const value = Number( val );
		const okColor = '#EEFFEE'; // light green
		const failColor = '#FFEEEE'; // light red

		if ( typeof value === 'number' && value < 0 ) {
			return { backgroundColor: '#EEEEEE' };
		}

		if ( typeof value !== 'number' || value === 0 || value > 50 ) {
			const { h, s } = hexToHSL( failColor );
			const l = 70;
			return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
		}

		if ( value > 0 && value <= 10 ) {
			const { h, s } = hexToHSL( okColor );
			const l = ( 70 + ( value * 2 ) );
			return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
		}
		const { h, s } = hexToHSL( failColor );
		const l = ( 100 - ( value / 3 ) );
		return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
	}, [] );

	const columnsDef = useMemo( () => {
		const types = {
			U: __( 'User' ),
			C: __( 'Search Console' ),
			S: __( 'People also search for' ),
			F: __( 'People also ask' ),
			'-': __( 'Not Scheduled' ),
		};

		const kw_levels = {
			H: __( 'High' ),
			M: __( 'Medium' ),
			L: __( 'Low' ),
			'': __( '-' ),
		};

		let header = {
			query: __( 'Query' ),
			type: __( 'Type' ),
			comp_intersections: __( 'Competitors' ),
			internal_links: __( 'Internal Links' ),
			labels: __( 'Tags' ),
			rating: __( 'Freq. Rating' ),
			country_volume: __( 'Volume' ),
			country_kd: __( 'Keyword Difficulty' ),
			country_level: __( 'Level' ),
			country_high_bid: __( 'High Bid' ),
			country_low_bid: __( 'Low Bid' ),
		};

		let columns = [
			columnHelper.accessor( 'query', {
				tooltip: ( cell ) => cell.getValue(),
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
				cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => setFetchOptions( { ...useTablePanels.getState().fetchOptions, query: cell.getValue(), queryFromClick: cell.getValue(), type: 'urls' } ) }>{ cell.getValue() }</strong>,
				header: ( th ) => <SortBy { ...th } />,
				minSize: 175,
			} ),
			columnHelper.accessor( 'type', {
				filterValMenu: types,
				tooltip: ( cell ) => types[ cell.getValue() ],
				cell: ( cell ) => types[ cell.getValue() ],
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),
			columnHelper.accessor( 'comp_intersections', {
				className: 'nolimit',
				cell: ( cell ) => cell.getValue(),
				header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
				size: 20,
			} ),
			columnHelper.accessor( 'internal_links', {
				className: 'nolimit',
				cell: ( cell ) => cell.getValue(),
				header: ( th ) => <SortBy { ...th } />,
				size: 20,
			} ),
			columnHelper.accessor( 'rating', {
				className: 'nolimit',
				cell: ( cell ) => cell.getValue(),
				header: ( th ) => <SortBy { ...th } />,
				size: 20,
			} ),
			columnHelper.accessor( 'country_volume', {
				className: 'nolimit',
				cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),
			columnHelper.accessor( 'country_kd', {
				className: 'nolimit',
				cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),
			columnHelper.accessor( 'country_level', {
				filterValMenu: kw_levels,
				className: 'nolimit',
				cell: ( cell ) => kw_levels[ cell.getValue() ],
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),
			columnHelper.accessor( 'country_low_bid', {
				className: 'nolimit',
				cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),
			columnHelper.accessor( 'country_high_bid', {
				className: 'nolimit',
				cell: ( cell ) => 'F' === cell.row.original.country_vol_status ? cell.getValue() : '-',
				header: ( th ) => <SortBy { ...th } />,
				size: 30,
			} ),

		];

		if ( fetchOptions ) {
			Object.values( fetchOptions.urls ).map( ( value, index ) => {
				if ( value ) {
					header = { ...header, [ `position_${ index }` ]: __( 'URL ' ) + index };

					columns = [ ...columns,
						columnHelper.accessor( `position_${ index }`, {
						className: 'nolimit',
						style: ( cell ) => cell?.row?.original.type === '-' ? { backgroundColor: '#EEEEEE' } : colorRanking( cell.getValue() ),
						cell: ( cell ) => {
							let url_name = cell?.row?.original[ `url_name_${ index }` ];

							if ( ! url_name ) {
								url_name = value;
							}

							return <a href={ url_name } title={ url_name } target="_blank" rel="noreferrer">
								{ url_name !== value && <strong>Another url </strong> }
								{ url_name === value && cell?.row?.original[ `words_${ index }` ] > 0 && <strong> x{ cell?.row?.original[ `words_${ index }` ] } </strong> }
								{ ( typeof cell?.getValue() === 'number' && cell?.getValue() > 0 ) && <strong> #{ cell?.getValue() } </strong> }
								{ cell?.getValue() === -1 && <strong>{ __( 'Max 5 domains' ) }</strong> }
							</a>;
						},
						header: ( th ) => <SortBy { ...th } />,
						size: 50,
					} ),
					];
				}
				return false;
			} );
		}

		columns = [ ...columns,
			columnHelper.accessor( 'labels', {
				className: 'nolimit',
				cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'query' } ) } />,
				header: header.labels,
				size: 150,
			} ),
	];

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
						paginationId,
						optionalSelector,
						slug,
						id: 'query',
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
	}, [ data, slug ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The Content Gap report is designed to identify overlapping SERP (Search Engine Results Page) queries within a provided list of URLs or domains. Maximum 15 URLs are allowed. By doing so, this tool aids in pinpointing the strengths and weaknesses of your website's keyword usage. It also provides suggestions for new keyword ideas that can enrich your content. Note that the depth and quality of the report are directly correlated with the number of keywords processed. Thus, allowing the plugin to process more keywords yields more detailed information about keyword clusters and variations used to find your or competitor websites. By using the keyword cluster filter, you can gain precise data on the ranking of similar keywords in SERP. To obtain a thorough understanding of how keyword clusters function, please visit www.urlslab.com website for more information." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noInsert
				noImport
				noDelete
				customPanel={ <GapDetailPanel slug={ slug } /> }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { updated: false, status: false, type: false, labels: false, country_level: false, country_kd: false, country_high_bid: false, country_low_bid: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				defaultSorting={ defaultSorting }
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
