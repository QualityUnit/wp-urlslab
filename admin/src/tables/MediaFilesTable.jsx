import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, Tooltip, SortMenu, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function MediaFilesTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater( { slug } );

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
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
	} = useInfiniteFetch( { key: slug, url, pageId, currentFilters, sortingColumn } );

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
			header: null,
		} ),
		columnHelper?.accessor( 'filename', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: () => <MenuInput isFilter placeholder="Enter file name" defaultValue={ currentFilters.filename } onChange={ ( val ) => addFilter( 'filename', val ) }>{ header.filename }</MenuInput>,
			size: 150,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: () => <MenuInput isFilter placeholder="Enter file type" defaultValue={ currentFilters.filetype } onChange={ ( val ) => addFilter( 'filetype', val ) }>{ header.filetype }</MenuInput>,
			size: 80,
		} ),
		columnHelper?.accessor( 'filestatus', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ statusTypes } name={ cell.column.id } checkedId={ currentFilters.filestatus || '' } onChange={ ( val ) => addFilter( 'filestatus', val ) }>{ header.filestatus }</SortMenu>,
			size: 100,
		} ),
		columnHelper?.accessor( 'status_changed', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => __( 'Status changed' ),
			size: 100,
		} ),
		columnHelper?.accessor( 'width', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: () => <MenuInput isFilter placeholder="Enter Width" defaultValue={ currentFilters.width } onChange={ ( val ) => addFilter( 'width', val ) }>{ header.width }</MenuInput>,
			size: 50,
		} ),
		columnHelper?.accessor( 'height', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: () => <MenuInput isFilter placeholder="Enter Height" defaultValue={ currentFilters.height } onChange={ ( val ) => addFilter( 'height', val ) }>{ header.height }</MenuInput>,
			size: 50,
		} ),
		columnHelper?.accessor( 'filesize', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: () => <MenuInput isFilter placeholder="Enter size in kB" defaultValue={ currentFilters.filesize } onChange={ ( val ) => addFilter( 'filesize', val * 1024 ) }>{ header.filesize }</MenuInput>,
			size: 80,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			header: () => <MenuInput isFilter placeholder="Filter by usage " defaultValue={ currentFilters.file_usage_count } onChange={ ( val ) => addFilter( 'file_usage_count', val * 1024 ) }>{ header.file_usage_count }</MenuInput>,
			size: 80,
		} ),
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => {
				const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
				const isImage = cell.getValue().search( regex );
				return <Tooltip>{ isImage !== -1 && <img src={ cell.getValue() } alt="url" /> }</Tooltip>;
			},
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter URL" defaultValue={ currentFilters.url } onChange={ ( val ) => addFilter( 'url', val ) }>{ header.url }</MenuInput>,
			size: 250,
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
					? <Tooltip center>{ `${ header.filename } “${ row.filename }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>

		</>
	);
}
