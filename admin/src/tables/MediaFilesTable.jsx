import { useMemo } from 'react';
import {
	useInfiniteFetch, Tooltip, SortMenu, Checkbox, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function MediaFilesTable( { slug } ) {
	const pageId = 'fileid';

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
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'filename', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: header.filename,
			size: 150,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: header.filetype,
			size: 80,
		} ),
		columnHelper?.accessor( 'filestatus', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.filestatus,
			size: 100,
		} ),
		columnHelper?.accessor( 'status_changed', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => __( 'Status changed' ),
			size: 100,
		} ),
		columnHelper?.accessor( 'width', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: header.width,
			size: 50,
		} ),
		columnHelper?.accessor( 'height', {
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: header.height,
			size: 50,
		} ),
		columnHelper?.accessor( 'filesize', {
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: header.filesize,
			size: 80,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			header: header.file_usage_count,
			size: 80,
		} ),
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => {
				const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
				const isImage = cell.getValue().search( regex );
				return <Tooltip>{ isImage !== -1 && <img src={ cell.getValue() } alt="url" /> }</Tooltip>;
			},
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.url,
			size: 250,
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
					? <Tooltip center>{ `${ header.filename } “${ row.filename }”` } { __( 'has been deleted.' ) }</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>

		</>
	);
}
