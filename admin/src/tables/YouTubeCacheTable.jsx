import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, SortMenu, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function YouTubeCacheTable( { slug } ) {
	const pageId = 'videoid';

	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		thumb: __( 'Thumbnail' ),
		videoid: __( 'YouTube Id' ),
		status: __( 'Status' ),
		title: __( 'Title' ),
		published: __( 'Published' ),
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
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
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
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
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
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
