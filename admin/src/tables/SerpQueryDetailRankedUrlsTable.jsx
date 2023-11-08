import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { SingleSelectMenu, SortBy, TooltipSortingFiltering } from '../lib/tableImports';
import { renameModule } from '../lib/helpers';
import useAIGenerator from '../hooks/useAIGenerator';
import useTableStore from '../hooks/useTableStore';
import useInfiniteFetch from '../hooks/useInfiniteFetch';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import ColumnsMenu from '../elements/ColumnsMenu';
import Counter from '../components/RowCounter';
import TableFilters from '../components/TableFilters';
import TableActionsMenu from '../elements/TableActionsMenu';
import ExportPanel from '../components/ExportPanel';
import useTablePanels from '../hooks/useTablePanels';
import RefreshTableButton from '../elements/RefreshTableButton';

const header = {
	url_name: __( 'URL' ),
	url_title: __( 'Title' ),
	url_description: __( 'Description' ),
	position: __( 'Position' ),
	country_volume: __( 'Volume' ),
	country_value: __( 'Traffic Value' ),
};

const slug = 'serp-queries/query/top-urls';
const defaultSorting = [ { key: 'position', dir: 'ASC', op: '>' } ];

const domainTypes = {
	X: __( 'Uncategorized' ),
	M: __( 'My Domain' ),
	C: __( 'Competitor' ),
	I: __( 'Ignored' ),
};

function SerpQueryDetailRankedUrlsTable( ) {
	const queryDetailPanel = useTableStore( ( state ) => state.queryDetailPanel );
	const { query, country } = queryDetailPanel;
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { setAIGeneratorConfig } = useAIGenerator();

	const [ popupTableType, setPopupTableType ] = useState( 'A' );

	const customFetchOptions = { query, country, domain_type: popupTableType };

	const { data: topUrls, status, isSuccess: topUrlsSuccess, isFetchingNextPage, ref } = useInfiniteFetch( { slug, customFetchOptions, defaultSorting }, 20 );

	const activePanel = useTablePanels( ( state ) => state.activePanel );

	// action handling
	const handleCreatePost = useCallback( () => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			keywordsList: [ { q: query, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: query,
		} );
	}, [ query, setAIGeneratorConfig ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						slug,
						header,
						paginationId: 'url_id',
					},
				},
			}
		) );
	}, [ ] );

	const topUrlsCol = useMemo( () => [
		columnHelper.accessor( 'position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } defaultSorting={ defaultSorting } />,
			size: 20,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => domainTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'url_description', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'country_volume', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
		columnHelper.accessor( 'country_value', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue() && cell.getValue() > 0 ? cell.getValue() : '-',
			header: ( th ) => <SortBy { ...th } />,
			size: 30,
		} ),
	], [ columnHelper ] );

	return (
		<>
			<div className="urlslab-moduleView-headerBottom">
				<div className="flex flex-align-center mb-m">
					<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
						A: __( 'All URLs' ),
						M: __( 'My URLs' ),
						C: __( 'Competitor URLs' ),
					} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />
				</div>

				<div className="flex flex-justify-space-between flex-align-center">
					<TableFilters />

					<div className="ma-left flex flex-align-center">
						<TableActionsMenu options={ { noImport: true, noDelete: true } } />
						<Counter customFetchOptions={ customFetchOptions } className="ml-m mr-m" />
						<ColumnsMenu className="menu-left" />
						<RefreshTableButton defaultSorting={ defaultSorting } />
					</div>
				</div>
			</div>

			{ status === 'loading'
				? <Loader />
				: <div className="urlslab-panel-content">
					<div className="mt-l mb-l table-container">
						<Table
							columns={ topUrlsCol }
							initialState={ { columnVisibility: { country_value: false, country_volume: false } } }
							data={ topUrlsSuccess && topUrls?.pages?.flatMap( ( page ) => page ?? [] ) }
							disableAddNewTableRecord
							defaultSorting={ defaultSorting }
							referrer={ ref }
							loadingRows={ isFetchingNextPage }
						>
							<TooltipSortingFiltering customFetchOptions={ customFetchOptions } />
						</Table>

						{ popupTableType === 'M' && topUrls?.length === 0 && <div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your pages are ranking for this keyword' ) }</p>
							<Link
								className="urlslab-button active"
								to={ '/' + renameModule( 'urlslab-generator' ) }
								onClick={ handleCreatePost }
							>
								{ __( 'Create a Post' ) }
							</Link>
						</div>
						}
						{ popupTableType === 'C' && topUrls?.length === 0 && <div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your competitors are ranking for this keyword' ) }</p>
						</div>
						}
					</div>
				</div>
			}
			{ activePanel === 'export' &&
				<ExportPanel fetchOptions={ customFetchOptions } />
			}
		</>
	);
}

export default memo( SerpQueryDetailRankedUrlsTable );
