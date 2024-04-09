import { useCallback, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, SvgIcon, Tooltip, IconButton, RowActionButtons, DateTimeFormat, Stack, TableSelectCheckbox,
} from '../lib/tableImports';
import { getJson } from '../lib/helpers';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'videoid';

const header = {
	videoid: __( 'YouTube video ID', 'urlslab' ),
	title: __( 'Title', 'urlslab' ),
	captions: __( 'Captions', 'urlslab' ),
	status: __( 'Status', 'urlslab' ),
	usage_count: __( 'Usage', 'urlslab' ),
	status_changed: __( 'Changed', 'urlslab' ),
	microdata: __( 'Youtube microdata JSON', 'urlslab' ),
};
const initialState = { columnVisibility: { captions: false, microdata: false } };

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
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ 'usage_count' ],
			}
		) );
	}, [ setTable, slug ] );

	return init && <YouTubeCacheTable slug={ slug } />;
}

function YouTubeCacheTable( { slug } ) {
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
					title: `${ __( 'Video ID', 'urlslab' ) } “${ origCell.videoid }” ${ __( 'is used on these URLs', 'urlslab' ) }`, text: `${ __( 'Video title:', 'urlslab' ) } ${ cell.row._valuesCache.title[ 1 ] }`, slug, url: `${ origCell.videoid }/urls`, showKeys: [ { name: [ 'url_name', __( 'URL', 'urlslab' ) ] } ], listId: 'url_id', counter,
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const videoStatus = cell?.column?.status;

		return (
			<div key={ videoStatus } className="flex flex-align-center flex-justify-end">
				{ ( videoStatus === 'W' || videoStatus === 'D' ) &&
					<Tooltip title={ __( 'Accept', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{ ( videoStatus === 'P' || videoStatus === 'W' || videoStatus === 'A' || videoStatus === 'N' ) &&
					<Tooltip title={ __( 'Decline', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{ videoStatus !== 'N' &&
					<Tooltip title={ __( 'Regenerate', 'urlslab' ) } arrow placement="bottom">
						<IconButton size="xs" color="neutral" onClick={ () => onClick( 'N' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [ ] );

	const columns = useMemo( () => ! columnTypes ? [] : [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
		} ),
		columnHelper.accessor( ( cell ) => getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			cell: ( image ) =>
				<div className="video-thumbnail">
					<img src={ image?.getValue()?.thumbnails?.high?.url } alt={ image?.getValue()?.title } />
				</div>,
			header: ( ) => __( 'Thumbnail', 'urlslab' ),
			size: 80,
		} ),
		columnHelper.accessor( 'videoid', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( ( cell ) => [ cell?.videoid, getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			tooltip: ( cell ) => cell.getValue()[ 1 ],
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'captions', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper.accessor( 'status', {
			cell: ( cell ) => columnTypes?.status.values[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
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
			header: header.usage_count,
			size: 60,
		} ),
		columnHelper.accessor( 'status_changed', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell } ) }
			>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),

	], [ activatePanel, columnHelper, columnTypes, deleteRow, setUnifiedPanel, updateRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading || isLoadingColumnTypes ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The plugin features a table that compiles all YouTube videos found on your website. This includes metadata for each video, a paid feature provided by the URLsLab Service. The metadata is used to enrich the HTML with schema fields, assisting Google in better identifying and indexing videos on your site, thereby potentially enhancing your website's ranking compared to your competitors. Moreover, the plugin offers a lazy loading feature for video iframes. This means that the iframes will only load when a user clicks on a video, avoiding slow loading times when a visitor initially opens the page. Until the visitor decides to watch a video, a thumbnail image is displayed instead of prematurely loading the iframe.", 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom noImport />

			<Table
				className="fadeInto"
				columns={ columns }
				initialState={ initialState }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
