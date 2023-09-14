import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, Loader, LinkIcon, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, AcceptIcon, DisableIcon, RefreshIcon, IconButton, RowActionButtons, DateTimeFormat,
} from '../lib/tableImports';
import { getJson } from '../lib/helpers';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function YouTubeCacheTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'videoid';

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

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const setUnifiedPanel = ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );

		if ( origCell.usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: `Video ID “${ origCell.videoid }” is used on these URLs`, text: `Video title: ${ cell.row._valuesCache.title[ 1 ] }`, slug, url: `${ origCell.videoid }/urls`, showKeys: [ { name: [ 'url_name', 'URL' ] } ], listId: 'url_id',
				},
			} ] );
		}
	};

	const ActionButton = ( { cell, onClick } ) => {
		const { status: videoStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( videoStatus === 'W' || videoStatus === 'D' ) &&
					<IconButton className="mr-s c-saturated-green"
						tooltip={ __( 'Accept' ) }
						tooltipClass="align-left"
						onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( videoStatus === 'P' || videoStatus === 'W' || videoStatus === 'A' || videoStatus === 'N' ) &&
					<IconButton className="mr-s c-saturated-red"
						tooltip={ __( 'Decline' ) }
						tooltipClass="align-left"
						onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					videoStatus !== 'N' &&
					<IconButton className="mr-s" tooltip={ __( 'Regenerate' ) } tooltipClass="align-left" onClick={ () => onClick( 'N' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	const header = {
		thumb: __( 'Thumbnail' ),
		videoid: __( 'YouTube video ID' ),
		title: __( 'Title' ),
		captions: __( 'Captions' ),
		status: __( 'Status' ),
		usage_count: __( 'Usage' ),
		status_changed: __( 'Changed' ),
		microdata: __( 'Youtube microdata JSON' ),
	};

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ 'usage_count' ],
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
		columnHelper?.accessor( ( cell ) => getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			cell: ( image ) =>
				<div className="video-thumbnail">
					<img src={ image?.getValue()?.thumbnails?.high?.url } alt={ image?.getValue()?.title } />
				</div>,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'videoid', {
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( ( cell ) => [ cell?.videoid, getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue()[ 1 ] }</Tooltip>,
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper?.accessor( 'captions', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper?.accessor( 'status', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper?.accessor( 'usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 0 );
					} }>
						<LinkIcon />
						<Tooltip className="align-left">{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.usage_count,
			size: 60,
		} ),
		columnHelper?.accessor( 'status_changed', {
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

	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				initialState={ { columnVisibility: { captions: false, microdata: false } } }
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
