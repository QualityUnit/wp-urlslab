import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, Tooltip, Checkbox, Trash, SortMenu, LinkIcon, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function MediaFilesTable( { slug } ) {
	const pageId = 'fileid';

	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = `${ filters || '' }${ sortingColumn || '' }`;

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

	const { row, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const driverTypes = {
		D: 'Database',
		F: 'Local File',
		S: 'S3',
	};

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		filename: __( 'File Name' ),
		filetype: __( 'File Type' ),
		url: __( 'Orig. URL' ),
		download_url: __( 'Offloaded URL' ),
		filesize: __( 'File Size' ),
		width: __( 'Width' ),
		height: __( 'Height' ),
		driver: __( 'Storage Driver' ),
		filestatus: __( 'Status' ),
		file_usage_count: __( 'Usage' ),
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
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => {
				const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
				const isImage = cell.getValue().search( regex );
				return <Tooltip>{ isImage !== -1 && <img src={ cell.getValue() } alt="url" /> }</Tooltip>;
			},
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.url,
			size: 200,
		} ),
		columnHelper?.accessor( 'download_url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.download_url,
			size: 200,
		} ),
		columnHelper?.accessor( 'filesize', {
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: header.filesize,
			size: 80,
		} ),
		columnHelper?.accessor( 'width', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: header.width,
			size: 50,
		} ),
		columnHelper?.accessor( 'height', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: header.height,
			size: 50,
		} ),
		columnHelper?.accessor( 'driver', {
			filterValMenu: driverTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ driverTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.driver,
			size: 100,
		} ),
		columnHelper?.accessor( 'filestatus', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: header.filestatus,
			size: 80,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Files used on these URLs`, slug, url: `${ cell.row.original.fileid }/urls`, showKeys: [ 'url_name' ], listId: 'url_id',
					} ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.file_usage_count,
			size: 50,
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
				detailsOptions={ detailsOptions }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ pageId, 'fileid', 'filehash' ],
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
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>

		</>
	);
}
