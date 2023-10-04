/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useI18n } from '@wordpress/react-i18n';
import { memo, useMemo, useRef, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import useTablePanels from '../hooks/useTablePanels';

import { getUrlQueries } from '../lib/serpUrls';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { SortBy, TooltipSortingFiltering } from '../lib/tableImports';
import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import useCloseModal from '../hooks/useCloseModal';
import ColumnsMenu from '../elements/ColumnsMenu';

function SerpUrlDetailQueryTable( { url, slug } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { activatePanel, setOptions } = useTablePanels();
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const { handleClose } = useCloseModal();

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

	const { data: similarQueries, isSuccess: similarQueriesSuccess } = useQuery( {
		queryKey: [ slug, url ],
		queryFn: async () => {
			return await getUrlQueries( url );
		},
	} );

	const header = {
		query: __( 'Query' ),
		matching_urls: __( 'URL Intersections' ),
		comp_urls: __( 'Comp. URLs' ),
		my_urls: __( 'My URLs' ),
		my_min_pos: __( 'My best position' ),
	};

	const cols = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <strong className="urlslab-serpPanel-keywords-item"
				onClick={ () => handleSimKeyClick( cell.row.original.query, cell.row.original.country ) }>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy { ...th } customHeader={ header } />,
			size: 60,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customHeader={ header } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customHeader={ header } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customHeader={ header } />,
			size: 20,
		} ),
	];

	const handleSimKeyClick = ( keyword, countryvar ) => {
		setOptions( { queryDetailPanel: { query: keyword, country: countryvar, slug: keyword.replace( ' ', '-' ) } } );
		activatePanel( 'queryDetailPanel' );
	};

	return (
		<div>
			<div className="urlslab-serpPanel-title">
				<div className="urlslab-serpPanel-description">
					<h4>{ __( 'Queries where URL ranks' ) }</h4>
					<p>{ __( 'Table shows list of queries, where selected URL ranks in top 100 based on loaded SERP data.' ) }</p>
				</div>
			</div>

			{ ! similarQueriesSuccess && <Loader /> }
			{ similarQueriesSuccess && similarQueries?.length > 0 &&
				<div className="urlslab-panel-content">

					<div className="mt-l mb-l table-container">
						<Table
							columns={ cols }
							data={ similarQueriesSuccess && similarQueries }
						>
							<TooltipSortingFiltering />
						</Table>
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
							options={ { slug: 'serp-urls/url/queries', stopFetching, fetchBodyObj: { url } } } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			}
		</div>
	);
}

export default memo( SerpUrlDetailQueryTable );
