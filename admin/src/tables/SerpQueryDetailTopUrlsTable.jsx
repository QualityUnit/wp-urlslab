import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getTopUrls } from '../lib/serpQueries';
import { ProgressBar, SingleSelectMenu, SortBy } from '../lib/tableImports';
import { renameModule } from '../lib/helpers';
import useAIGenerator from '../hooks/useAIGenerator';
import useTableStore from '../hooks/useTableStore';
import { sortingArray } from '../hooks/filteringSorting';

import Button from '@mui/joy/Button';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import ColumnsMenu from '../elements/ColumnsMenu';
import ExportCSVButton from '../elements/ExportCSVButton';
import DescriptionBox from '../elements/DescriptionBox';

function SerpQueryDetailTopUrlsTable( { query, country, slug, handleClose } ) {
	const { __ } = useI18n();
	const { setAIGeneratorConfig } = useAIGenerator();
	const columnHelper = useMemo( () => createColumnHelper(), [] );

	const [ popupTableType, setPopupTableType ] = useState( 'A' );
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || [] );

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

	const { data: topUrls, status, isSuccess: topUrlsSuccess } = useQuery( {
		queryKey: [ slug, popupTableType, sorting ],
		queryFn: async () => {
			const response = await getTopUrls( { query, country, domain_type: popupTableType === 'A' ? null : popupTableType, limit: 500, sorting: [ ...sortingArray( slug ), { col: 'url_id', dir: 'ASC' } ] } );
			return response;
		},
	} );

	// action handling
	const handleCreatePost = () => {
		// setting the correct zustand state
		setAIGeneratorConfig( {
			keywordsList: [ { q: query, checked: true } ],
			serpUrlsList: [],
			dataSource: 'SERP_CONTEXT',
			selectedPromptTemplate: '4',
			title: query,
		} );
		handleClose();
	};

	// Table Top URLs
	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_description: __( 'Description' ),
		position: __( 'Position' ),
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

	const topUrlsCol = [
		columnHelper.accessor( 'position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <Link to={ cell.getValue() } target="_blank">{ cell.getValue() }</Link>,
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 50,
		} ),
		columnHelper.accessor( 'url_description', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 50,
		} ),
	];

	return (
		<div>
			<div className="urlslab-serpPanel-title">
			</div>

			<div className="flex flex-align-center">
				<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
					A: __( 'All URLs' ),
					M: __( 'My URLs' ),
					C: __( 'Competitor URLs' ),
				} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />
				<ColumnsMenu className="ma-left menu-left" customSlug={ slug } />
			</div>
			{ status === 'loading'
				? <Loader />
				: <div className="urlslab-panel-content">
					<div className="mt-l mb-l table-container">
						{ topUrls.length && <Table
							columns={ topUrlsCol }
							data={ topUrlsSuccess && topUrls }
							disableAddNewTableRecord
							customSlug={ slug }
						/>
						}
						{ popupTableType === 'M' && topUrls.length === 0 && <div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your pages are ranking for this keyword' ) }</p>
							<Link
								className="urlslab-button active"
								to={ '/' + renameModule( 'urlslab-generator' ) }
								onClick={ handleCreatePost }>{ __( 'Create a Post' ) }</Link>
						</div>
						}
						{ popupTableType === 'C' && topUrls.length === 0 && <div className="urlslab-serpPanel-empty-table">
							<p>{ __( 'None of your competitors are ranking for this keyword' ) }</p>
						</div>
						}
					</div>

					<div className="mt-l padded">
						{ exportStatus
							? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
							: null
						}
					</div>
					<div className="flex mt-m ma-left">
						<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { ml: 'auto' } }>{ __( 'Cancel' ) }</Button>
						<ExportCSVButton
							className="ml-s"
							options={ { slug: 'serp-queries/query/top-urls', stopFetching, fetchBodyObj: { query, country, domain_type: popupTableType } } } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			}
		</div>
	);
}

export default memo( SerpQueryDetailTopUrlsTable );
