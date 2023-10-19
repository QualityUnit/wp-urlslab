import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, SvgIcon, IconButton, RowActionButtons, DateTimeFormat, Stack,
} from '../lib/tableImports';
import { getJson } from '../lib/helpers';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import DescriptionBox from '../elements/DescriptionBox';

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
					<Tooltip title={ __( 'Accept' ) }>
						<IconButton size="xs" color="success" onClick={ () => onClick( 'A' ) }>
							<SvgIcon name="activate" />
						</IconButton>
					</Tooltip>
				}
				{
					( videoStatus === 'P' || videoStatus === 'W' || videoStatus === 'A' || videoStatus === 'N' ) &&
					<Tooltip title={ __( 'Decline' ) }>
						<IconButton size="xs" color="danger" onClick={ () => onClick( 'D' ) }>
							<SvgIcon name="disable" />
						</IconButton>
					</Tooltip>
				}
				{
					videoStatus !== 'N' &&
					<Tooltip title={ __( 'Regenerate' ) }>
						<IconButton size="xs" color="neutral" onClick={ () => onClick( 'N' ) }>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
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

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

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
			tooltip: ( cell ) => cell.getValue()[ 1 ],
			cell: ( val ) => <a href={ `https://youtu.be/${ val?.getValue()[ 0 ] }` } target="_blank" rel="noreferrer">{ val?.getValue()[ 1 ] }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper?.accessor( 'captions', {
			tooltip: ( cell ) => cell.getValue(),
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
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( "The plugin features a table that compiles all YouTube videos found on your website. This includes metadata for each video, a paid feature provided by the URLsLab Service. The metadata is used to enrich the HTML with schema fields, assisting Google in better identifying and indexing videos on your site, thereby potentially enhancing your website's ranking compared to your competitors. Moreover, the plugin offers a lazy loading feature for video iframes. This means that the iframes will only load when a user clicks on a video, avoiding slow loading times when a visitor initially opens the page. Until the visitor decides to watch a video, a thumbnail image is displayed instead of prematurely loading the iframe." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				initialState={ { columnVisibility: { captions: false, microdata: false } } }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
