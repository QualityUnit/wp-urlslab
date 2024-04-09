import { useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, SortBy, Tooltip, SingleSelectMenu, SvgIcon, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, TagsMenu, RowActionButtons, IconButton, Stack, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'fileid';
const header = {
	filename: __( 'File name', 'urlslab' ),
	url: __( 'Original URL', 'urlslab' ),
	download_url: __( 'Offloaded URL', 'urlslab' ),
	filetype: __( 'File type', 'urlslab' ),
	filesize: __( 'File size', 'urlslab' ),
	width: __( 'Width', 'urlslab' ),
	height: __( 'Height', 'urlslab' ),
	filestatus: __( 'Status', 'urlslab' ),
	driver: __( 'Storage driver', 'urlslab' ),
	usage_count: __( 'Usage', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};
const initialState = { columnVisibility: { width: false, height: false, labels: false } };

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
		} );
		useTablePanels.setState( () => ( {
			deleteCSVCols: [ paginationId, 'fileid', 'filehash' ],
		} ) );
	}, [ setTable, slug ] );

	return init && <MediaFilesTable slug={ slug } />;
}

function MediaFilesTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const setOptions = useTablePanels( ( state ) => state.setOptions );

	const { columnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { deleteRow, updateRow } = useChangeRow();

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		const counter = cell?.getValue();
		setOptions( [] );
		setRowToEdit( {} );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: __( 'This file is used on the following URLs', 'urlslab' ), slug, url: `${ origCell.fileid }/urls`, showKeys: [ { name: [ 'url_name', __( 'URL', 'urlslab' ) ] } ], listId: 'url_id', counter,
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug ] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( 'filename', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url', {
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
		columnHelper.accessor( 'download_url', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'filetype', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'filesize', {
			tooltip: ( cell ) => cell.getValue(),
			unit: 'kB',
			cell: ( cell ) => `${ Math.round( cell.getValue() / 1024, 0 ) }\u00A0kB`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'width', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'height', {
			unit: 'px',
			cell: ( cell ) => `${ cell.getValue() }\u00A0px`,
			header: ( th ) => <SortBy { ...th } />,
			size: 50,
		} ),
		columnHelper.accessor( 'filestatus', {
			cell: ( cell ) => columnTypes?.filestatus.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'driver', {
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ columnTypes?.driver.values } name={ cell.column.id } value={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, customEndpoint: '/transfer', cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'usage_count', {
			cell: ( cell ) => (
				<Stack direction="row" alignItems="center" spacing={ 1 }>
					<>
						<span>{ cell?.getValue() }</span>
						{ cell?.getValue() > 0 &&
							<Tooltip title={ __( 'Show URLs where used', 'urlslab' ) } arrow placement="bottom">
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
			cell: ( cell ) => <TagsMenu value={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
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
	], [ activatePanel, columnHelper, columnTypes, deleteRow, setUnifiedPanel, slug, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of all images and other media files found on your website. Images are added to this list through real-time processing as each page is displayed. All optimization tasks, such as generating WebP images, are performed on images identified and saved in this list during background cron jobs. Processing can take a few days. You can also track the usage of specific images. If an image is no longer present on your website, the plugin can automatically hide it to ensure sustained page quality.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom
				noImport
				hiddenFilters={ [ 'download_url' ] }
			/>

			<Table
				className="fadeInto"
				initialState={ initialState }
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
