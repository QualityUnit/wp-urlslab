import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, Trash, SingleSelectMenu, LinkIcon, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function MediaFilesTable( { slug } ) {
	const paginationId = 'fileid';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

	const [ detailsOptions, setDetailsOptions ] = useState( null );
	const [ tooltipUrl, setTooltipUrl ] = useState( );

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
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const driverTypes = {
		D: 'Database',
		F: 'Local file',
		S: 'Amazon S3',
	};

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
		E: __( 'Error' ),
	};

	const header = {
		filename: __( 'File name' ),
		filetype: __( 'File type' ),
		url: __( 'Original URL' ),
		download_url: __( 'Offloaded URL' ),
		labels: __( 'Tags' ),
		filesize: __( 'File size' ),
		width: __( 'Width' ),
		height: __( 'Height' ),
		driver: __( 'Storage driver' ),
		filestatus: __( 'Status' ),
		file_usage_count: __( 'Usage' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'filename', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.filename }</SortBy>,
			size: 200,
		} ),
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => {
				if ( tooltipUrl === cell.getValue() ) {
					const regex = /(jpeg|jpg|webp|gif|png|svg)/g;
					const isImage = cell.getValue().search( regex );
					return <Tooltip>{ isImage !== -1 && <img src={ cell.getValue() } alt="url" /> }</Tooltip>;
				}
				return false;
			},
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			cell: ( cell ) => <a onMouseOver={ () => setTooltipUrl( cell.getValue() ) } onMouseLeave={ () => setTooltipUrl() } href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url }</SortBy>,
			size: 100,
		} ),
		columnHelper?.accessor( 'download_url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.download_url }</SortBy>,
			size: 100,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.filetype }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'filesize', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.filesize }</SortBy>,
			size: 50,
		} ),
		columnHelper?.accessor( 'width', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.width }</SortBy>,
			size: 50,
		} ),
		columnHelper?.accessor( 'height', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.height }</SortBy>,
			size: 50,
		} ),
		columnHelper?.accessor( 'filestatus', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.filestatus }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'driver', {
			filterValMenu: driverTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ driverTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, customEndpoint: '/transfer', cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.driver }</SortBy>,
			size: 100,
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
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.file_usage_count }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 150,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
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
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				detailsOptions={ detailsOptions }
				exportOptions={ {
					slug,
					url,
					paginationId,
					deleteCSVCols: [ paginationId, 'fileid', 'filehash' ],
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
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>

		</>
	);
}
