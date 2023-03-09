import {
	useInfiniteFetch, handleSelected, Tooltip, SortMenu, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function YouTubeCacheTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
	const pageId = 'videoid';

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
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
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
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ statusTypes } name={ cell.column.id } checkedId={ currentFilters.status || '' } onChange={ ( val ) => addFilter( 'status', val ) }>{ header.status }</SortMenu>,
			size: 80,
		} ),
		columnHelper?.accessor( ( cell ) => [ cell?.videoid, JSON.parse( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue()[ 1 ] }</Tooltip>,
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: () => <MenuInput isFilter placeholder="Enter title" defaultValue={ currentFilters.title } onChange={ ( val ) => addFilter( 'title', val ) }>{ header.title }</MenuInput>,
			size: 450,
		} ),
		columnHelper?.accessor( ( cell ) => JSON.parse( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.publishedAt, {
			id: 'published',
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: header.published,
			size: 100,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) } />,
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
				currentFilters={ currentFilters }
				header={ header }
				noImport
				removeFilters={ ( key ) => removeFilters( key ) }
				onSort={ ( val ) => sortBy( val ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'dest_url_id' ],
				} }
			/>
			<Table className="fadeInto" columns={ columns }
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
