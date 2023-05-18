import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, Trash, Loader, LinkIcon, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import IconButton from '../elements/IconButton';
import { ReactComponent as AcceptIcon } from '../assets/images/icons/icon-activate.svg';
import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-cron-refresh.svg';

export default function YouTubeCacheTable( { slug } ) {
	const paginationId = 'videoid';

	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

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
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { row, selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const ActionButton = ( { cell, onClick } ) => {
		const { status: videoStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( videoStatus === 'W' || videoStatus === 'D' ) &&
					<IconButton className="mr-s c-saturated-green" tooltip={ __( 'Accept' ) } tooltipClass="align-left" onClick={ () => onClick( 'A' ) }>
						<AcceptIcon />
					</IconButton>
				}
				{
					( videoStatus === 'P' || videoStatus === 'W' || videoStatus === 'A' || videoStatus === 'N' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Decline' ) } tooltipClass="align-left" onClick={ () => onClick( 'D' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( videoStatus === 'A' || videoStatus === 'D' || videoStatus === 'P' ) &&
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
		videoid: __( 'YouTube Video ID' ),
		status: __( 'Status' ),
		title: __( 'Title' ),
		captions: __( 'Captions' ),
		published: __( 'Published' ),
		usage_count: __( 'Usage' ),
		microdata: __( 'Youtube Microdata JSON' ),
	};

	const getJson = ( param ) => {
		try {
			return JSON.parse( param );
		} catch ( e ) {
			return null;
		}
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( ( cell ) => getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet, {
			id: 'thumb',
			className: 'thumbnail',
			cell: ( image ) =>
				<img src={ image?.getValue()?.thumbnails?.high?.url }
					alt={ image?.getValue()?.title } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.thumb }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'videoid', {
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.videoid }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'captions', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.captions }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'status', {
			filterValMenu: statusTypes,
			cell: ( cell ) => statusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.status }</SortBy>,
			size: 100,
		} ),
		columnHelper?.accessor( ( cell ) => [ cell?.videoid, getJson( `${ cell?.microdata }` )?.items[ 0 ]?.snippet?.title ], {
			id: 'title',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue()[ 1 ] }</Tooltip>,
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.title }</SortBy>,
			size: 450,
		} ),
		columnHelper?.accessor( 'usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Video ID “${ cell.row.original.videoid }” is used on these URLs`, text: `Video title: ${ cell.row._valuesCache.title[ 1 ] }`, slug, url: `${ cell.row.original.videoid }/urls`, showKeys: [ 'url_name' ], listId: 'url_id',
					} ) }>
						<LinkIcon />
						<Tooltip className="align-left">{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.usage_count,
			size: 80,
		} ),
		columnHelper.accessor( 'actions', {
			className: 'actions hoverize nolimit',
			cell: ( cell ) => <ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />,
			header: null,
			size: 70,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			tooltip: () => <Tooltip className="align-left xxxl">{ __( 'Delete item' ) }</Tooltip>,
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
				selectedRows={ selectedRows }
				onDeleteSelected={ deleteSelectedRows }
				onFilter={ ( filter ) => setFilters( filter ) }
				detailsOptions={ detailsOptions }
				exportOptions={ {
					slug,
					url,
					paginationId,
					deleteCSVCols: [ 'usage_count' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.videoid } “${ row.videoid }”` } { __( 'has been deleted.' ) }</Tooltip>
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
