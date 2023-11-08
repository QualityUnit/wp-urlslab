import { useCallback, useEffect, useMemo, memo } from 'react';
import { __ } from '@wordpress/i18n';
import { queryTypes, queryStatuses, queryScheduleIntervals, queryHeaders, queryLevels, queryIntents } from "../lib/queryColumns";

import {
    useInfiniteFetch,
    SortBy,
    Loader,
    Table,
    ModuleViewHeaderBottom,
    TooltipSortingFiltering,
    TagsMenu,
    IconButton,
    SvgIcon, SingleSelectMenu, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';
import useChangeRow from '../hooks/useChangeRow';

import hexToHSL from '../lib/hexToHSL';
import GapDetailPanel from '../components/detailsPanel/GapDetailPanel';
import { postFetch } from '../api/fetching';
import { setNotification } from '../hooks/useNotifications';

import '../assets/styles/layouts/ContentGapTableCells.scss';
import { Box, Tooltip } from '@mui/joy';
import {countriesList, countriesListForSelect} from "../api/fetchCountries";
import {getTooltipUrlsList} from "../lib/elementsHelpers";
import Button from "@mui/joy/Button";

const paginationId = 'query_id';
const optionalSelector = '';
const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

const maxProcessingAttempts = 3;

const validateResults = ( results ) => {
	const withError = Object.values( results ).filter( ( data ) => data.status === 'error' );
	if ( withError.length ) {
		setNotification( 'serp-gap/prepare/download-failed', {
			title: __( 'Download of some URLs failed.' ),
			message: __( 'Some data will not be present in table.' ),
			status: 'error',
		} );
	}
	return results;
};

const preprocessUrls = async ( { urls, parse_headers }, processing = 0 ) => {
	try {
		const response = await postFetch( 'serp-gap/prepare', { urls, parse_headers }, { skipErrorHandling: true } );

		if ( response.status === 200 ) {
			const results = await response.json();
			return validateResults( results );
		}

		if ( response.status === 404 ) {
			if ( processing < maxProcessingAttempts ) {
				return await preprocessUrls( { urls, parse_headers }, processing + 1 );
			}
			const results = await response.json();
			return validateResults( results );
		}

		if ( response.status === 400 ) {
			const results = await response.json();
			return validateResults( results );
		}

		throw new Error( 'Failed to process URLs.' );
	} catch ( error ) {
		setNotification( 'serp-gap/prepare/error', { message: error.message, status: 'error' } );
		return [];
	}
};

const colorRankingBackground = ( val ) => {
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
};

const colorRankingInnerStyles = ( { position, words } ) => {
	const styles = {};

	if ( position !== null ) {
		const value = Number( position );
		if ( value > 0 && value <= 50 ) {
			styles[ '--position-color' ] = '#000000';
		} else {
			styles[ '--position-color' ] = '#FFFFFF';
		}
	}

	if ( words !== null ) {
		const value = Number( words );
		if ( value > 0 && value <= 20 ) {
			styles[ '--words-backgroundColor' ] = '#2CA34D'; // green light
		} else if ( value > 20 && value <= 50 ) {
			styles[ '--words-backgroundColor' ] = '#187E36'; // green medium
		} else if ( value > 50 ) {
			styles[ '--words-backgroundColor' ] = '#106228'; // green dark
		}
	}

	return styles;
};

const emptyUrls = ( urls ) => {
	if ( ! urls || ( urls && Object.keys( urls ).length === 0 ) ) {
		return true;
	}

	return Object.values( urls ).filter( ( url ) => url !== '' ).length
		? false
		: true;
};

const SerpContentGapTable = memo( ( { slug } ) => {
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	//const [ processing, setProcessing ] = useState( false );
	const urls = fetchOptions?.urls;
	const parse_headers = fetchOptions?.parse_headers;
	const processedUrls = fetchOptions?.processedUrls;
	const query = fetchOptions?.query;
	const forceUrlsProcessing = fetchOptions?.forceUrlsProcessing;
	const processing = fetchOptions?.processing;

	useEffect( () => {
		// do not run processing on direct Content Gap tab opening with default data defined
		if ( forceUrlsProcessing && ( query && ! emptyUrls( urls ) && parse_headers !== undefined ) ) {
			const runProcessing = async () => {
				const results = await preprocessUrls( { urls, parse_headers } );
				setFetchOptions( {
					...useTablePanels.getState().fetchOptions,
					forceUrlsProcessing: false,
					processedUrls: results,
					processing: false,
				} );
				//setProcessing( false );
			};
			//setProcessing( true );
			setFetchOptions( { ...useTablePanels.getState().fetchOptions, processing: true } );
			runProcessing();
		}
	}, [ forceUrlsProcessing, query, urls, parse_headers, setFetchOptions ] );

	return (
		<>
			<DescriptionBox title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The Content Gap report is designed to identify overlapping SERP (Search Engine Results Page) queries within a provided list of URLs or domains. Maximum 15 URLs are allowed. By doing so, this tool aids in pinpointing the strengths and weaknesses of your website's keyword usage. It also provides suggestions for new keyword ideas that can enrich your content. Note that the depth and quality of the report are directly correlated with the number of keywords processed. Thus, allowing the plugin to process more keywords yields more detailed information about keyword clusters and variations used to find your or competitor websites. By using the keyword cluster filter, you can gain precise data on the ranking of similar keywords in SERP. To obtain a thorough understanding of how keyword clusters function, please visit www.urlslab.com website for more information." ) }
			</DescriptionBox>

			<GapDetailPanel slug={ slug } />

			<ModuleViewHeaderBottom
				noInsert
				noImport
				noDelete
			/>

			{ processedUrls === undefined &&
                // if processedUrls is undefined, we are waiting for first user input when was opened directly Content Gap table without any data defined previously
                // maybe we can show some instructions here, for now return nothing to keep this code known in place
                null
			}
			{ ( ! processing && processedUrls && Object.keys( processedUrls ).length > 0 ) && <TableContent slug={ slug } /> }
			{ processing && <Loader>{ __( 'Processing URLs…' ) }</Loader> }

		</>
	);
} );

const TableContent = memo( ( { slug } ) => {
	const { updateRow } = useChangeRow( { defaultSorting } );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const fetchOptions = useTableStore( ( state ) => state.tables[ slug ]?.fetchOptions );

	// handle updating of fetchOptions and append flag to run urls preprocess
	const updateFetchOptions = useCallback( ( data ) => {
		setFetchOptions( {
			...useTablePanels.getState().fetchOptions, ...data,
			forceUrlsProcessing: true,
			processedUrls: {},
		} );
	}, [ setFetchOptions ] );

	const urls = fetchOptions?.urls;

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting, wait: ! urls?.length } );

    const columnsDef = useMemo( () => {

        const headerCustom = {
            rating: __( 'Freq. Rating' ),
        };

        let header = {...queryHeaders, ...headerCustom};

        let columns = [
            columnHelper.accessor('query', {
                tooltip: (cell) => cell.getValue(),
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                cell: (cell) => <strong className="urlslab-serpPanel-keywords-item" onClick={() => updateFetchOptions({
                    query: cell.getValue(),
                    type: 'urls'
                })}>{cell.getValue()}</strong>,
                header: (th) => <SortBy {...th} />,
                minSize: 175,
            }),
            columnHelper.accessor( 'country', {
                filterValMenu: countriesListForSelect,
                cell: ( cell ) => <strong>{ countriesList[ cell.getValue() ] ? countriesList[ cell.getValue() ] : cell.getValue() }</strong>,
                header: ( th ) => <SortBy { ...th } />,
                minSize: 130,
            } ),
            columnHelper.accessor('type', {
                filterValMenu: queryTypes,
                tooltip: (cell) => queryTypes[cell.getValue()],
                cell: (cell) => queryTypes[cell.getValue()],
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor( 'schedule_interval', {
                filterValMenu: queryScheduleIntervals,
                className: 'nolimit',
                cell: ( cell ) => <SingleSelectMenu
                    name={ cell.column.id }
                    defaultValue={ cell.getValue() }
                    items={ queryScheduleIntervals }
                    onChange={ ( newVal ) => cell.getValue() !== newVal && updateRow( { newVal, cell } ) }
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
            columnHelper.accessor('comp_intersections', {
                className: 'nolimit',
                cell: (cell) => cell.getValue(),
                header: (th) => <SortBy {...th} defaultSorting={defaultSorting}/>,
                size: 20,
            }),
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
            columnHelper.accessor('internal_links', {
                className: 'nolimit',
                cell: (cell) => cell.getValue(),
                header: (th) => <SortBy {...th} />,
                size: 20,
            }),
            columnHelper.accessor('country_volume', {
                className: 'nolimit',
                cell: (cell) => cell.getValue() && cell.getValue()>0 ? cell.getValue() : '-',
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor('country_kd', {
                className: 'nolimit',
                cell: (cell) => cell.getValue() && cell.getValue()>0 ? cell.getValue() : '-',
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor('country_level', {
                filterValMenu: queryLevels,
                className: 'nolimit',
                cell: (cell) => queryLevels[cell.getValue()],
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor( 'intent', {
                filterValMenu: queryIntents,
                className: 'nolimit',
                cell: ( cell ) => queryIntents[ cell.getValue() ],
                header: ( th ) => <SortBy { ...th } />,
                size: 30,
            } ),
            columnHelper.accessor('country_low_bid', {
                className: 'nolimit',
                cell: (cell) => cell.getValue() && cell.getValue()>0 ? cell.getValue() : '-',
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor('country_high_bid', {
                className: 'nolimit',
                cell: (cell) => cell.getValue() && cell.getValue()>0 ? cell.getValue() : '-',
                header: (th) => <SortBy {...th} />,
                size: 30,
            }),
            columnHelper.accessor('rating', {
                className: 'nolimit',
                cell: (cell) => cell.getValue(),
                header: (th) => <SortBy {...th} />,
                size: 20,
            }),
            columnHelper.accessor( 'labels', {
                className: 'nolimit',
                cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
                header: queryHeaders.labels,
                size: 100,
            } ),
        ];

		if ( urls ) {
			Object.values( urls ).map( ( value, index ) => {
				if ( value ) {
					header = { ...header, [ `position_${ index }` ]: __( 'URL ' ) + ( index + 1 ) };
					columns = [ ...columns,
						columnHelper.accessor( `position_${ index }`, {
							className: 'nolimit',
							style: ( cell ) => cell?.row?.original.type === '-' ? { backgroundColor: '#EEEEEE' } : colorRankingBackground( cell.getValue() ),
							//tooltip: ( cell ) => cell?.row?.original[ `url_name_${ index }` ] || value,
							cell: ( cell ) => {
								const url_name = cell?.row?.original[ `url_name_${ index }` ];
								const position = cell?.getValue();

								// value with x, ie x5
								const isWords = ( url_name === null || url_name === value ) && cell?.row?.original[ `words_${ index }` ] > 0;

								// value with hash, ie #5
								const isPosition = typeof position === 'number' && position > 0;

								const cellStyles = colorRankingInnerStyles( {
									words: isWords ? cell?.row?.original[ `words_${ index }` ] : null,
									position: isPosition ? position : null,
								} );

								return <div>
									<Box className="content-gap-cell" sx={ { ...cellStyles } }>

										<div className="content-gap-cell-grid">
											{ position === -1 &&
											<div className="content-gap-cell-grid-value">
												<Tooltip title={ __( 'Comparing max 5 domains.' ) }>
													<IconButton size="xs" color="neutral">
														<SvgIcon name="info" />
													</IconButton>
												</Tooltip>
											</div>
											}
											<div
												className="content-gap-cell-grid-value content-gap-cell-grid-value-words">
												{ isWords &&
												<Tooltip title={ cell?.row?.original[ `words_${ index }` ] + ' ' + __( 'keyword occurrences in the URL content' ) }>
													<div className="value-wrapper">{ cell?.row?.original[ `words_${ index }` ] }</div>
												</Tooltip>
												}
											</div>
											{ isPosition &&
											<Tooltip title={ __( 'Position in search results: ' ) + position }>
												<div className="content-gap-cell-grid-value content-gap-cell-grid-value-position">
													{ `${ position }.` }
												</div>
											</Tooltip>
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
							},
							header: ( th ) => <SortBy { ...th } tooltip={ value } />,
							size: 100,
						} ),
					];
				}
				return false;
			} );
		}

		columns = [ ...columns,
			columnHelper.accessor( 'labels', {
				className: 'nolimit',
				cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug }
					onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'query' } ) } />,
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
	}, [ updateFetchOptions, slug, urls, columnHelper, __ ] );

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
                           country_low_bid: false
                       }
                   }}
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
});

export default SerpContentGapTable;
