import {
	useInfiniteFetch, handleInput, handleSelected, RangeSlider, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function YouTubeCacheTable() {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilter, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'youtube-cache', url: `${ filters }${ sortingColumn }`, pageId: 'videoid' } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
			size: 24,
		} ),
		columnHelper?.accessor( ( row ) => JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			cell: ( image ) => <img src={ image?.getValue()?.thumbnails?.default?.url } alt={ image?.getValue()?.title
			} />,
			header: () => __( 'Thumbnail' ),
			size: 80,
		} ),
		columnHelper?.accessor( 'videoid', {
			header: () => __( 'YouTube Id' ),
			size: 80,
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			className: 'youtube-status',
			header: () => __( 'Status' ),
		} ),
		columnHelper?.accessor( ( row ) => [ row?.videoid, JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: () => __( 'Title' ),
			size: 350,
		} ),
		columnHelper?.accessor( ( row ) => JSON.parse( `${ row?.microdata }` )?.items[ 0 ]?.snippet?.publishedAt, {
			id: 'published',
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => __( 'Published' ),
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			{ /* <ModuleViewHeaderBottom
				slug={slug}
				currentFilters={currentFilters}
				header={header}
				removedFilter={(key) => removeFilter(key)}
				exportOptions={{
					url: slug,
					filters,
					fromId: 'from_kw_id',
					pageId: 'kw_id',
					deleteCSVCols: ['kw_id', 'destUrlMd5'],
				}}
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={header} name="sorting" onChange={(val) => sortBy(val)} />
				</div>
			</ModuleViewHeaderBottom> */ }
			<Table className="fadeInto" columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
