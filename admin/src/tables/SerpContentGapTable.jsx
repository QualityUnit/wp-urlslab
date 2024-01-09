import { useCallback, useEffect, useMemo, memo } from 'react';
import { __ } from '@wordpress/i18n';

import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	TagsMenu,
	IconButton,
	Checkbox,
	SvgIcon, SingleSelectMenu, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useChangeRow from '../hooks/useChangeRow';
import useSerpGapCompare from '../hooks/useSerpGapCompare';
import useSelectRows from '../hooks/useSelectRows';
import { countriesList } from '../api/fetchCountries';

import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { colorRankingBackground, colorRankingInnerStyles, emptyUrls } from '../lib/serpContentGapHelpers';
import { queryTypes, queryStatuses, queryScheduleIntervals, queryHeaders, queryLevels, queryIntents } from '../lib/serpQueryColumns';

import Box from '@mui/joy/Box';
import Tooltip from '@mui/joy/Tooltip';
import Button from '@mui/joy/Button';

import DescriptionBox from '../elements/DescriptionBox';
import GapDetailPanel from '../components/detailsPanel/GapDetailPanel';

import '../assets/styles/layouts/ContentGapTableCells.scss';

const paginationId = 'query_id';
const optionalSelector = '';
const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];
const headerCustom = {
	rating: __( 'Freq. Rating' ),
};

const SerpContentGapTable = memo( ( { slug } ) => {
	const selectedRows = useSelectRows( ( state ) => state.selectedRows?.[ slug ] );
	const setSelectedRows = useSelectRows( ( state ) => state.setSelectedRows );

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	const processingUrls = contentGapOptions?.processingUrls ? contentGapOptions.processingUrls : false;

	const customButtons = selectedRows && Object.keys( selectedRows ).length
		? {
			monitoring: <Button onClick={ () => activatePanel( 'contentGapMonitoring' ) } >{ __( 'Add Query' ) }</Button>,
		}
		: null;

	useEffect( () => {
		if ( ! emptyUrls( fetchOptions.urls ) ) {
			setSelectedRows( {} );
			useTableStore.setState( () => (
				{
					tables: {
						...useTableStore.getState().tables,
						[ slug ]: {
							...useTableStore.getState().tables[ slug ],
							fetchOptions,
							allowCountFetchAbort: true,
							allowTableFetchAbort: true,
						} },
				}
			) );
		}
	}, [ fetchOptions, setSelectedRows, slug ] );

	return (
		<>
			<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The Content Gap report is designed to identify overlapping SERP (Search Engine Results Page) queries within a provided list of URLs or domains. Maximum 15 URLs are allowed. By doing so, this tool aids in pinpointing the strengths and weaknesses of your website's keyword usage. It also provides suggestions for new keyword ideas that can enrich your content. Note that the depth and quality of the report are directly correlated with the number of keywords processed. Thus, allowing the plugin to process more keywords yields more detailed information about keyword clusters and variations used to find your or competitor websites. By using the keyword cluster filter, you can gain precise data on the ranking of similar keywords in SERP. To obtain a thorough understanding of how keyword clusters function, please visit www.urlslab.com website for more information." ) }
			</DescriptionBox>

			<GapDetailPanel />

			{ // show table if fetchOptions are filled
				( Object.keys( fetchOptions ).length > 0 && ! processingUrls ) &&
				<>
					<ModuleViewHeaderBottom
						noInsert
						noImport
						noDelete
						customButtons={ customButtons }
					/>

					<TableContent slug={ slug } />
				</>
			}
			{ processingUrls && <Loader>{ __( 'Processing URLs…' ) }</Loader> }

		</>
	);
} );

const TableContent = memo( ( { slug } ) => {
	const { compareUrls } = useSerpGapCompare( 'query' );
	const { isSelected, selectRows, updateRow } = useChangeRow( { defaultSorting } );

	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions );
	const setContentGapOptions = useTablePanels( ( state ) => state.setContentGapOptions );
	// handle updating of fetchOptions and append flag to run urls preprocess
	const updateOptions = useCallback( ( data ) => {
		setContentGapOptions( {
			...data,
			forceUrlsProcessing: true,
			processedUrls: {},
		} );
	}, [ setContentGapOptions ] );

	const urls = fetchOptions?.urls;

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting, wait: ! urls?.length } );

	const header = useMemo( () => {
		let urlsHeader = {};
		if ( urls ) {
			Object.values( urls ).forEach( ( value, index ) => {
				if ( value ) {
					urlsHeader = { ...urlsHeader, [ `position_${ index }` ]: `${ __( 'URL' ) } ${ index + 1 }` };
				}
			} );
		}
		return { ...queryHeaders, ...headerCustom, ...urlsHeader };
	}, [ urls ] );

	const urlsColumns = useMemo( () => {
		return urls
			? Object.values( urls ).map( ( value, index ) => (
				columnHelper.accessor( `position_${ index }`, {
					className: 'nolimit',
					style: ( cell ) => cell?.row?.original.type === '-' ? { backgroundColor: '#EEEEEE' } : colorRankingBackground( cell.getValue() ),
					cell: ( cell ) => <ContentGapCell cell={ cell } index={ index } value={ value } />,
					header: ( th ) => <SortBy { ...th } tooltip={ value } customHeader={ `${ __( 'URL' ) } ${ index + 1 }` } />,
					size: 100,
				} )
			) )
			: [];
	}, [ columnHelper, urls ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item" onClick={ () => updateOptions( {
				query: cell.getValue(),
				type: 'urls',
			} ) }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 175,
		} ),
		columnHelper.accessor( 'country', {
			cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 130,
		} ),
		columnHelper.accessor( 'type', {
			filterValMenu: queryTypes,
			tooltip: ( cell ) => queryTypes[ cell.getValue() ],
			cell: ( cell ) => queryTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'schedule_interval', {
			filterValMenu: queryScheduleIntervals,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu
				name={ cell.column.id }
				defaultValue={ cell.getValue() }
				items={ queryScheduleIntervals }
				onChange={ ( newVal ) => cell.getValue() !== newVal && updateRow( { newVal, cell, id: 'query' } ) }
				className="table-hidden-input"
				defaultAccept
				autoClose
			/>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: queryStatuses,
			className: 'nolimit',
			cell: ( cell ) => queryStatuses[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'schedule', {
			className: 'nolimit',
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 40,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 20,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, urlsArray: cell.getValue(), country: cell.row.original.country } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue().join( ', ' ),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( { cell, urlsArray: cell.getValue(), country: cell.row.original.country } ) }
					>
						{ __( 'Content Gap' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue().join( ', ' ),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top10', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top100', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'internal_links', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		columnHelper.accessor( 'country_volume', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_kd', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_level', {
			filterValMenu: queryLevels,
			className: 'nolimit',
			cell: ( cell ) => queryLevels[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'intent', {
			filterValMenu: queryIntents,
			className: 'nolimit',
			cell: ( cell ) => queryIntents[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_low_bid', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_high_bid', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'rating', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 20,
		} ),
		...urlsColumns,
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug }
				onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'query' } ) } />,
			header: header.labels,
			size: 150,
		} ),
	], [ columnHelper, urlsColumns, header.labels, isSelected, selectRows, updateOptions, updateRow, compareUrls, slug ] );

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
						header,
						id: 'query',
					},
				},
			}
		) );
	}, [ slug, header ] );

	//Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

	if ( status === 'loading' ) {
		return <Loader>{ __( 'Preparing table data…' ) }</Loader>;
	}

	return (
		<>
			<Table className="fadeInto"
				initialState={ {
					columnVisibility: {
						country: false,
						type: false,
						status: false,
						updated: false,
						comp_urls: false,
						my_urls: false,
						my_urls_ranked_top10: false,
						my_urls_ranked_top100: false,
						internal_links: false,
						schedule_interval: false,
						schedule: false,
						labels: false,
						country_level: false,
						country_kd: false,
						country_high_bid: false,
						country_low_bid: false,
					},
				} }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				defaultSorting={ defaultSorting }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
} );

const ContentGapCell = memo( ( { cell, index, value } ) => {
	const url_name = cell?.row?.original[ `url_name_${ index }` ];
	const position = cell?.getValue();
	const isWords = ( url_name === null || url_name === value ) && cell?.row?.original[ `words_${ index }` ] > 0;
	const isPosition = typeof position === 'number' && position > 0;

	const cellStyles = colorRankingInnerStyles( {
		words: isWords ? cell?.row?.original[ `words_${ index }` ] : null,
		position: isPosition ? position : null,
	} );

	return <div>
		<Box className="content-gap-cell" sx={ { ...cellStyles } }>

			<div className="content-gap-cell-grid">

				{ /* keep always visible .content-gap-cell-grid-value to keep value alignment in own column */ }
				<div
					className="content-gap-cell-grid-value content-gap-cell-grid-value-words">
					{ isWords &&
						<Tooltip title={ cell?.row?.original[ `words_${ index }` ] + ' ' + __( 'keyword occurrences in the URL content' ) }>
							<div className="value-wrapper">{ cell?.row?.original[ `words_${ index }` ] }</div>
						</Tooltip>
					}
				</div>

				{ /* keep always visible .content-gap-cell-grid-value to keep value alignment in own column */ }
				<Tooltip title={ isPosition ? __( 'Position in search results: ' ) + position : null }>
					<div className="content-gap-cell-grid-value content-gap-cell-grid-value-position">
						{ isPosition && `${ position }.` }
					</div>
				</Tooltip>

				{ /* keep always visible .content-gap-cell-grid-value to keep value alignment in own column */ }
				{ position === -1 &&
				<div className="content-gap-cell-grid-value">
					<Tooltip title={ __( 'Comparing max 5 domains.' ) }>
						<IconButton size="xs" color="neutral">
							<SvgIcon name="info" />
						</IconButton>
					</Tooltip>
				</div>
				}
			</div>

			{ url_name && url_name !== value &&
				<Tooltip title={ <Box component="a" href={ url_name } target="_blank"
					rel="noreferrer"
					sx={ ( theme ) => ( { color: theme.vars.palette.common.white } ) }>{ __( 'Better ranking URL: ' ) + url_name }</Box> }>
					<Box component="a" href={ url_name } target="_blank"
						className="content-gap-cell-urlIcon">
						<SvgIcon name="link-disabled" />
					</Box>
				</Tooltip>
			}

		</Box>
	</div>;
} );

export default SerpContentGapTable;
