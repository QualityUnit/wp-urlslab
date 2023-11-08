import { useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, SortBy, Tooltip, Checkbox, SingleSelectMenu, SvgIcon, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons, IconButton, Stack,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'fileid';

const driverTypes = {
	D: __( 'Database' ),
	F: __( 'Local file' ),
	//TODO S3		S:  __( 'Amazon S3' ),
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

export default function MediaFilesTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow, updateRow } = useChangeRow();

	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );

		if ( origCell.file_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: __( 'This file is used on the following URLs' ), slug, url: `${ origCell.fileid }/urls`, showKeys: [ { name: [ 'url_name', 'URL' ] } ], listId: 'url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug ] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ paginationId, 'fileid', 'filehash' ],
			}
		) );
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
					},
				},
			}
		) );
	}, [ slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper?.accessor( 'filename', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper?.accessor( 'url', {
			tooltip: ( cell ) => {
				const TooltipContent = () => {
					const [ imageLoaded, setImageLoaded ] = useState( false );
					const regex = /(jpeg|jpg|webp|gif|png|svg|api\.urlslab\.com)/g;
					const isImage = cell.getValue().search( regex );
					if ( isImage !== -1 ) {
						return <>
							<Box sx={ { display: imageLoaded ? 'none' : 'block' } }>{ cell.getValue() }</Box>
							<Box
								component="img"
								src={ cell.getValue() }
								alt="url"
								onLoad={ () => setImageLoaded( true ) }
								sx={ {
									// just show image nice with tooltip corners
									borderRadius: 'var(--urlslab-radius-sm)',
									display: imageLoaded ? 'block' : 'none',
									marginY: 0.25,
									maxWidth: '15em',
								} }
							/>
						</>;
					}
					return cell.getValue();
				};

				return <TooltipContent />;
			},
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'download_url', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'filetype', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'filesize', {
			tooltip: ( cell ) => cell.getValue(),
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
			cell: ( cell ) => <SingleSelectMenu autoClose items={ driverTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, customEndpoint: '/transfer', cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used' ) }>
								<IconButton
									size="xs"
									onClick={ () => {
										setUnifiedPanel( cell );
										activatePanel( 0 );
									} }
								>
									<SvgIcon name="link" />
								</IconButton>
							</Tooltip>
						}
					</>
				</Stack>
			),
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
	], [ activatePanel, columnHelper, deleteRow, selectRows, setUnifiedPanel, slug, updateRow ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of all images and other media files found on your website. Images are added to this list through real-time processing as each page is displayed. All optimization tasks, such as generating WebP images, are performed on images identified and saved in this list during background cron jobs. Processing can take a few days. You can also track the usage of specific images. If an image is no longer present on your website, the plugin can automatically hide it to ensure sustained page quality.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { width: false, height: false, labels: false } } }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>

		</>
	);
}
