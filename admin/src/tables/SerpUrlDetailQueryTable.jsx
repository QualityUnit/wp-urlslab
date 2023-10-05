/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useI18n } from '@wordpress/react-i18n';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import useTableStore from '../hooks/useTableStore';
import { sortingArray } from '../hooks/filteringSorting';
import { postFetch } from '../api/fetching';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import { getTooltipUrlsList } from '../lib/elementsHelpers';
import { SortBy } from '../lib/tableImports';
import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import ColumnsMenu from '../elements/ColumnsMenu';

function SerpUrlDetailQueryTable( { url, slug, handleClose } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting );
	const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];

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
		queryKey: [ slug, url, sorting ],
		queryFn: async () => {
			const response = await postFetch( 'serp-urls/url/queries', { url, sorting: [ ...sortingArray( slug ), { col: 'url_id', dir: 'ASC' } ] } );
			return response.json();
		},
	} );

	const header = {
		position: __( 'Position' ),
		query: __( 'Query' ),
		my_urls: __( 'My URLs' ),
		comp_urls: __( 'Comp. URLs' ),
		comp_intersections: __( 'Competitors' ),
		my_position: __( 'My best position' ),
		my_urls_ranked_top10: __( 'My URLs in Top 10' ),
		my_urls_ranked_top100: __( 'My URLs in Top 100' ),
		internal_links: __( 'Internal Links' ),
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
						sorting: defaultSorting,
					},
				},
			}
		) );
	}, [ slug ] );

	const cols = [
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'position', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 10,
		} ),
		columnHelper.accessor( 'comp_intersections', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 10,
		} ),
		columnHelper.accessor( 'my_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'comp_urls', {
			tooltip: ( cell ) => getTooltipUrlsList( cell.getValue() ),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 100,
		} ),
		columnHelper.accessor( 'my_position', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top10', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
		columnHelper.accessor( 'my_urls_ranked_top100', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
		columnHelper.accessor( 'internal_links', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 20,
		} ),
	];

	return (
		<div>
			<div className="urlslab-serpPanel-title">
				<div className="urlslab-serpPanel-description">
					<h4>{ __( 'Queries where URL ranks' ) }</h4>
					<p>{ __( 'Table shows list of queries, where selected URL ranks in top 100 based on loaded SERP data.' ) }</p>
				</div>
			</div>

			<div className="urlslab-serpPanel-input flex flex-align-center">
				<ColumnsMenu className="ma-left menu-left" customSlug={ slug } />
			</div>

			{ ! similarQueriesSuccess && <Loader /> }
			{ similarQueriesSuccess && similarQueries?.length > 0 &&
			<div className="urlslab-panel-content">

				<div className="mt-l mb-l table-container">
					<Table
						columns={ cols }
						data={ similarQueriesSuccess && similarQueries }
						customSlug={ slug }
					/>
				</div>

				<div className="mt-l padded">
					{ exportStatus
						? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
						: null
					}
				</div>
				<div className="flex mt-m ma-left">
					<Button variant="plain" color="neutral" onClick={ hidePanel }
						sx={ { ml: 'auto' } }>{ __( 'Cancel' ) }</Button>
					<ExportCSVButton
						className="ml-s"
						options={ { slug: 'serp-urls/url/queries', stopFetching, fetchBodyObj: { url } } }
						onClick={ handleExportStatus }
					/>
				</div>
			</div>
			}
		</div>
	);
}

export default memo( SerpUrlDetailQueryTable );
