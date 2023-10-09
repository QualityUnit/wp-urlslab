/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useI18n } from '@wordpress/react-i18n';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

import { postFetch } from '../api/fetching';
import useTableStore from '../hooks/useTableStore';
import { sortingArray } from '../hooks/filteringSorting';

import { SingleSelectMenu, SortBy } from '../lib/tableImports';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import ColumnsMenu from '../elements/ColumnsMenu';
import DescriptionBox from '../elements/DescriptionBox';

function SerpUrlDetailSimilarUrlsTable( { url, slug, handleClose } ) {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );
	const sorting = useTableStore( ( state ) => state.tables[ slug ]?.sorting || [] );
	const defaultSorting = [ { key: 'cnt_queries', dir: 'DESC', op: '<' } ];
	const [ popupTableType, setPopupTableType ] = useState( 'A' );

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

	const { data: similarQueries, isSuccess: UrlsSuccess } = useQuery( {
		queryKey: [ slug, url, sorting, popupTableType ],
		queryFn: async () => {
			const response = await postFetch( 'serp-urls/url/similar-urls', { url, domain_type: popupTableType === 'A' ? null : popupTableType, sorting: [ ...sortingArray( slug ), { col: 'query_id', dir: 'ASC' } ] } );
			return response.json();
		},
	} );

	const domainTypes = {
		X: __( 'Uncategorized' ),
		M: __( 'My Domain' ),
		C: __( 'Competitor' ),
		I: __( 'Ignored' ),
	};

	const header = {
		url_name: __( 'URL' ),
		cnt_queries: __( 'Intersections' ),
		top10_queries_cnt: __( 'Top 10 Queries' ),
		top100_queries_cnt: __( 'Top 100 Queries' ),
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
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			size: 200,
		} ),
		columnHelper.accessor( 'cnt_queries', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top10_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			minSize: 50,
		} ),
		columnHelper.accessor( 'top100_queries_cnt', {
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } customSlug={ slug } />,
			minSize: 50,
		} ),
	];

	return (
		<div>

			<DescriptionBox
				title={ __( 'Similar URLs intersecting through ranked queries' ) }
				sx={ { mb: 2 } }
			>
				{ __( 'Table shows list of URLs most similar to selected URL based on number of intersecting queries' ) }
			</DescriptionBox>

			<div className="flex flex-align-center">
				<SingleSelectMenu defaultAccept autoClose key={ popupTableType } items={ {
					A: __( 'All URLs' ),
					M: __( 'My URLs' ),
					C: __( 'Competitor URLs' ),
				} } name="url_view_type" defaultValue={ popupTableType } onChange={ ( val ) => setPopupTableType( val ) } />
				<ColumnsMenu className="ma-left menu-left" customSlug={ slug } />
			</div>

			{ ! UrlsSuccess && <Loader /> }
			{ UrlsSuccess && similarQueries?.length > 0 &&
			<div className="urlslab-panel-content">

				<div className="mt-l mb-l table-container">
					<Table
						columns={ cols }
						data={ UrlsSuccess && similarQueries }
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
						options={ { slug: 'serp-urls/url/similar-urls', stopFetching, fetchBodyObj: { url } } }
						onClick={ handleExportStatus }
					/>
				</div>
			</div>
			}
		</div>
	);
}

export default memo( SerpUrlDetailSimilarUrlsTable );
