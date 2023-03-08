import {
	useInfiniteFetch, handleInput, handleSelected, RangeSlider, SortMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function MediaFilesTable( { slug } ) {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
	const pageId = 'fileid';

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( {
		key: slug, url, pageId } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		filename: __( 'File Name' ),
		filetype: __( 'File Type' ),
		status_changed: __( 'Status changed' ),
		filestatus: __( 'Status' ),
		height: __( 'Height' ),
		width: __( 'Width' ),
		filesize: __( 'File Size' ),
		file_usage_count: __( 'File Usage' ),
		url: __( 'URL' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper?.accessor( 'filename', {
			header: () => __( 'File Name' ),
			size: 150,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: () => __( 'File Type' ),
			size: 80,
		} ),
		columnHelper?.accessor( 'filestatus', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => __( 'Status' ),
			size: 100,
		} ),
		columnHelper?.accessor( 'status_changed', {
			header: () => __( 'Status changed' ),
			size: 100,
		} ),
		columnHelper?.accessor( 'height', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: () => __( 'Height' ),
			size: 50,
		} ),
		columnHelper?.accessor( 'width', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: () => __( 'Width' ),
			size: 50,
		} ),
		columnHelper?.accessor( 'filesize', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: () => __( 'File Size' ),
			size: 60,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			header: () => __( 'File Usage' ),
			size: 60,
		} ),
		columnHelper?.accessor( 'url', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => __( 'URL' ),
			size: 300,
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
				removeFilters={ ( array ) => removeFilters( array ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_fileid',
					pageId: 'fileid',
					deleteCSVCols: [ 'fileid', 'destUrlMd5' ],
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			{ tableHidden
				? null
				: <Table className="fadeInto" columns={ columns }
					data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				>
					<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
				</Table>
			}
		</>
	);
}
