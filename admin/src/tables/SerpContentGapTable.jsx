/* eslint-disable indent */
import { useEffect, useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import {
	useInfiniteFetch,
	Button,
	ProgressBar,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	RowActionButtons,
	TooltipSortingFiltering,
	TagsMenu,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import useChangeRow from '../hooks/useChangeRow';
import useSerpGapCompare from '../hooks/useSerpGapCompare';

import hexToHSL from '../lib/hexToHSL';
import GapDetailPanel from '../components/detailsPanel/GapDetailPanel';

export default function SerpContentGapTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'query_id';
	const optionalSelector = 'country';

	const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const comparedKeys = fetchOptions?.domains || fetchOptions?.urls;

	const { updateRow } = useChangeRow();
	const { compareUrls } = useSerpGapCompare( 'query' );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const showCompare = ( cell ) => {
		if ( comparedKeys ) {
			return comparedKeys?.some( ( key, index ) => cell?.row?.original[ `position_${ index }` ] !== 0 );
		}
		return false;
	};

	const handleCompareUrls = ( cell ) => {
		let urlsArray = [];
		if ( comparedKeys ) {
			comparedKeys.map( ( key, index ) => {
				const url = cell?.row?.original[ `url_name_${ index }` ];
				if ( url ) {
					urlsArray = [
						...urlsArray,
						url,
					];
				}
				return false;
			} );
		}
		compareUrls( cell, urlsArray, false );
	};

	const colorRanking = ( val ) => {
		const value = Number( val );
		const okColor = '#EEFFEE'; // light green
		const failColor = '#FFEEEE'; // light red

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
	};

	const columnsDef = useMemo( () => {
		let header = {
			query: __( 'Query' ),
			country: __( 'Country' ),
			comp_intersections: __( 'Competitors' ),
			internal_links: __( 'Internal Links' ),
			labels: __( 'Tags' ),
		};

		let columns = [
			columnHelper.accessor( 'query', {
				tooltip: ( cell ) => cell.getValue(),
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
				cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => setFetchOptions( { ...useTablePanels.getState().fetchOptions, query: cell.getValue(), queryFromClick: cell.getValue(), type: fetchOptions?.urls ? 'urls' : 'domains' } ) }>{ cell.getValue() }</strong>,
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
						header = { ...header, [ `position_${ index }` ]: value };

						columns = [ ...columns,
							columnHelper.accessor( `position_${ index }`, {
							className: 'nolimit',
							style: ( cell ) => colorRanking( cell.getValue() ),
							cell: ( cell ) => {
								if ( typeof cell?.getValue() !== 'number' || cell?.getValue() === 0 ) {
									return <strong>{ __( 'Not ranked' ) }</strong>;
								}
								if ( cell?.getValue() === -1 ) {
									return <strong>{ __( 'Max 3 domains allowed.' ) }</strong>;
								}
									return <div><strong>{ cell?.getValue() }</strong> <a href={ cell?.row?.original[ `url_name_${ index }` ] } title={ cell?.row?.original[ `url_name_${ index }` ] } target="_blank"
									rel="noreferrer">{ cell?.row?.original[ `url_name_${ index }` ] }</a></div>;
							},
							header: ( th ) => <SortBy { ...th } />,
							size: 50,
						} ),
						];
					}
					return false;
				} );
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
			columnHelper.accessor( 'editRow', {
				className: 'editRow',
				cell: ( cell ) => <RowActionButtons
				>
					{
						showCompare( cell ) &&
						<Button
							size="xxs"
							onClick={ () => handleCompareUrls( cell ) }
						>
							{ __( 'Compare' ) }
						</Button>
					}
				</RowActionButtons>,
				header: null,
				size: 0,
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
			<DescriptionBox	title={ __( 'Learn more…' ) } isMainTableDescription>
				{ __( "The Content Gap report is designed to identify overlapping SERP (Search Engine Results Page) queries within a provided list of URLs or domains. By doing so, this tool aids in pinpointing the strengths and weaknesses of your website's keyword usage. It also provides suggestions for new keyword ideas that can enrich your content. Note that the depth and quality of the report are directly correlated with the number of keywords processed. Thus, allowing the plugin to process more keywords yields more detailed information about keyword clusters and variations used to find your or competitor websites. By using the keyword cluster filter, you can gain precise data on the ranking of similar keywords in SERP. To obtain a thorough understanding of how keyword clusters function, please visit www.urlslab.com website for more information." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noInsert
				noImport
				noDelete
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
