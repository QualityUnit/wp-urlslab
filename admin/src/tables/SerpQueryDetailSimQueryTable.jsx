/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import useSerpGapCompare from '../hooks/useSerpGapCompare';
import { filtersArray, sortingArray } from '../hooks/useFilteringSorting';

import { getQueryClusterKeywords } from '../lib/serpQueries';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { RowActionButtons, SortBy } from '../lib/tableImports';

import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import ColumnsMenu from '../elements/ColumnsMenu';
import DescriptionBox from '../elements/DescriptionBox';
import TableFilters from '../components/TableFilters';

function SerpQueryDetailSimQueryTable( { query, country, slug, handleClose } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ queryClusterData, setQueryClusterData ] = useState( { competitorCnt: 2, maxPos: 10 } );
	const { activatePanel, setOptions } = useTablePanels();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );

	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || [] );
	const filters = useTableStore( ( state ) => state.tables[ slug ]?.filters || {} );

	const { compareUrls } = useSerpGapCompare( 'query' );

	const hidePanel = () => {
		stopFetching.current = true;

		handleClose();
	};

	const handleExportStatus = ( val ) => {
		setExportStatus( val );
		if ( val === 100 ) {
			setTimeout( () => {
				setExportStatus();
			}, 1000 );
		}
	};

	const { data: similarQueries, isFetching, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ slug, query, country, queryClusterData, sorting, filters ],
		queryFn: async () => {
			const response = await getQueryClusterKeywords( {
				query,
				country,
				max_position: queryClusterData.maxPos,
				competitors: queryClusterData.competitorCnt,
				sorting: [ ...sortingArray( slug ), { col: 'query_id', dir: 'ASC' } ],
				filters: [ ...filtersArray( filters ) ],
			} );
			return response;
		},
	} );

	const header = {
		query: __( 'Query' ),
		matching_urls: __( 'URL Intersections' ),
		comp_urls: __( 'Comp. URLs' ),
		my_urls: __( 'My URLs' ),
		my_min_pos: __( 'My best position' ),
	};

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						slug,
						header,
					},
				},
			}
		) );
	}, [ slug ] );

	const cols = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
				onClick={ () => handleSimKeyClick( cell.row.original.query, cell.row.original.country ) }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 60,
		} ),
		columnHelper.accessor( 'matching_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( cell, cell.getValue() ) }
					>
						{ __( 'Compare' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( cell, cell.getValue() ) }
					>
						{ __( 'Compare' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => <>
				{ getTooltipUrlsList( cell.getValue() ) }
				{ cell.getValue().length > 0 &&
					<Button
						size="xs"
						sx={ { mt: 1 } }
						onClick={ () => compareUrls( cell, cell.getValue() ) }
					>
						{ __( 'Compare' ) }
					</Button>
				}
			</>,
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_min_pos', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons>
				{
					<Button
						component={ Link }
						to="/KeywordsLinks/keyword"
						size="xxs"
						onClick={ () => {
							setRowToEdit( { ...rowToEdit, keyword: cell?.row?.original?.query, urlLink: cell?.row?.original?.my_urls[ 0 ] } );
							activatePanel( 'rowInserter' );
						} }
						sx={ { mr: 1 } }
					>
						{ __( 'Create Keyword' ) }
					</Button>
				}
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	const handleSimKeyClick = ( keyword, countryvar ) => {
		setOptions( { queryDetailPanel: { query: keyword, country: countryvar, slug: keyword.replace( ' ', '-' ) } } );
		activatePanel( 'queryDetailPanel' );
	};

	return (
		<div>
			<DescriptionBox
				title={ __( 'Learn more…' ) }
				sx={ { mb: 2 } }
			>
				{ __( 'It is list of similar queries identified by intersection of urls in top X results in Google search results. You can define your own intersection limits (e.g. min 3 urls from 10 or more strict 5 from 10). Basic idea behind the cluster is, that if Google ranked same urls for different keywords, those keywords are related and maybe you should cover all of them on single URL of your website.' ) }
			</DescriptionBox>

			<div className="flex flex-align-center mb-m">
				<div>
					<InputField labelInline type="number" liveUpdate defaultValue={ queryClusterData.competitorCnt }
						label={ __( 'Number of Competitors' ) } onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, competitorCnt: val } ) } />
				</div>
				<div>
					<InputField labelInline className="ml-s" type="number" liveUpdate defaultValue={ queryClusterData.maxPos }
						label={ __( 'Maximum Position' ) } onChange={ ( val ) => setQueryClusterData( { ...queryClusterData, maxPos: val } ) } />
				</div>
			</div>

			<div className="flex flex-justify-space-between flex-align-center">
				<TableFilters customSlug={ slug } />
				<ColumnsMenu className="ml-ultra menu-left" customSlug={ slug } />
			</div>

			{ isFetching
				? <Loader />
				: <div className="urlslab-panel-content">

					<div className="mt-l mb-l table-container">
						<Table
							columns={ cols }
							data={ similarQueriesSuccess && similarQueries?.length ? similarQueries : [] }
							customSlug={ slug }
							disableAddNewTableRecord
						/>
					</div>

					<div className="mt-l padded">
						{ exportStatus
							? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
							: null
						}
					</div>

					<div className="flex mt-m ma-left">
						<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel' ) }</Button>
						<ExportCSVButton
							options={ {
								slug: 'serp-queries/query-cluster',
								stopFetching,
								fetchBodyObj: { query, country, max_position: queryClusterData.maxPos, competitors: queryClusterData.competitorCnt },
							} }
							onClick={ handleExportStatus }
						/>
					</div>
				</div>
			}
		</div>
	);
}

export default memo( SerpQueryDetailSimQueryTable );
