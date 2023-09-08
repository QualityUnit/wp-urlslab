import { useState, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, SingleSelectMenu, LinkIcon, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function MediaFilesTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'fileid';

	const [ tooltipUrl, setTooltipUrl ] = useState( );

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { selectRows, deleteRow, updateRow } = useChangeRow();

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();
	const setUnifiedPanel = ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );

		if ( origCell.file_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `This file is used on the following URLs`, slug, url: `${ origCell.fileid }/urls`, showKeys: [ { name: 'url_name' } ], listId: 'url_id',
				},
			} ] );
		}
	};

	const driverTypes = {
		D: 'Database',
		F: 'Local file',
		//TODO S3		S: 'Amazon S3',
	};

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		X: __( 'Not processing' ),
		D: __( 'Disabled' ),
		E: __( 'Error' ),
	};

	const header = {
		filename: __( 'File name' ),
		url: __( 'Original URL' ),
		download_url: __( 'Offloaded URL' ),
		filetype: __( 'File type' ),
		filesize: __( 'File size' ),
		width: __( 'Width' ),
		height: __( 'Height' ),
		filestatus: __( 'Status' ),
		driver: __( 'Storage driver' ),
		file_usage_count: __( 'Usage' ),
		labels: __( 'Tags' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId, 'fileid', 'filehash' ],
			}
		) );
		useTableStore.setState( () => (
			{
				paginationId,
				slug,
				header,
			}
		) );
	}, [] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				data,
			}
		) );
	}, [ data ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper?.accessor( 'filename', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
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
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'download_url', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'filesize', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper?.accessor( 'width', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper?.accessor( 'height', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper?.accessor( 'filestatus', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'driver', {
			filterValMenu: driverTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu items={ driverTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, customEndpoint: '/transfer', cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 0 );
					} }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: ( th ) => <SortBy { ...th } />,
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
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'filename' } ) }
			>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { width: false, height: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				<TooltipSortingFiltering />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>

		</>
	);
}
