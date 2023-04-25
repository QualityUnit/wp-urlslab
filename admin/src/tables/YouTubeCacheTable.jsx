import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, Tooltip, Checkbox, Trash, Loader, LinkIcon, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function YouTubeCacheTable( { slug } ) {
	const pageId = 'videoid';

	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = `${ 'undefined' === typeof filters ? '' : filters }${ 'undefined' === typeof sortingColumn ? '' : sortingColumn }`;

	const [ detailsOptions, setDetailsOptions ] = useState( null );

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows } = useChangeRow( { data, url, slug, pageId } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		thumb: __( 'Thumbnail' ),
		videoid: __( 'YouTube Video ID' ),
		status: __( 'Status' ),
		title: __( 'Title' ),
		published: __( 'Published' ),
		usage_count: __( 'Usage' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			tooltip: ( image ) =>
				<Tooltip><img src={ image.getValue()?.thumbnails?.high?.url } alt={ image?.getValue()?.title } /></Tooltip>,
			cell: ( image ) =>
				<img src={ image?.getValue()?.thumbnails?.high?.url }
					alt={ image?.getValue()?.title } />,
			header: header.thumb,
			size: 80,
		} ),
		columnHelper?.accessor( 'videoid', {
			header: header.videoid,
			size: 80,
		} ),
		columnHelper?.accessor( 'status', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: header.status,
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => [ cell?.videoid, JSON.parse( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue()[ 1 ] }</Tooltip>,
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: header.title,
			size: 450,
		} ),
		columnHelper?.accessor( 'usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Video ID “${ cell.row.original.videoid }” is used on these URLs`, text: `Video title: ${ cell.row._valuesCache.title[ 1 ] }`, slug, url: `${ cell.row.original.videoid }/urls`, showKeys: [ 'url_name' ], listId: 'url_id',
					} ) }>
						<LinkIcon />
						<Tooltip className="align-left">{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.usage_count,
			size: 80,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				header={ header }
				table={ table }
				noImport
				selectedRows={ selectedRows }
				onSort={ ( val ) => sortBy( val ) }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				detailsOptions={ detailsOptions }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'dest_url_id' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.videoid } “${ row.videoid }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
