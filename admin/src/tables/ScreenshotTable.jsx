import { useCallback, useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Tooltip, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, TagsMenu, SvgIcon, IconButton, RowActionButtons, Stack,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import Box from '@mui/joy/Box';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'url_id';
const scrStatusTypes = {
	N: __( 'Waiting' ),
	A: __( 'Active' ),
	P: __( 'Pending' ),
	U: __( 'Updating' ),
	E: __( 'Error' ),
};

const header = {
	url_name: __( 'Destination URL' ),
	url_title: __( 'Title' ),
	scr_status: __( 'Status' ),
	update_scr_date: __( 'Last change' ),
	screenshot_usage_count: __( 'Usage' ),
	labels: __( 'Tags' ),
};
export default function ScreenshotTable( { slug } ) {
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

		if ( origCell.screenshot_usage_count > 0 ) {
			setOptions( [ {
				detailsOptions: {
					title: __( 'Screenshot used on these URLs' ), slug, url: `${ origCell.url_id }/linked-from`, showKeys: [ { name: [ 'src_url_name', __( 'Source URL' ) ] } ], listId: 'src_url_id',
				},
			} ] );
		}
	}, [ setOptions, setRowToEdit, slug ] );

	const ActionButton = useMemo( () => ( { cell, onClick } ) => {
		const { status: scrStatus } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					scrStatus !== 'N' &&
					<Tooltip title={ __( 'Regenerate' ) }>
						<IconButton
							size="xs"
							onClick={ () => onClick( 'N' ) }
						>
							<SvgIcon name="refresh" />
						</IconButton>
					</Tooltip>
				}
			</div>
		);
	}, [] );

	useEffect( () => {
		useTablePanels.setState( () => (
			{
				deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
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
		columnHelper?.accessor( 'screenshot_url_thumbnail', {
			tooltip: ( cell ) => <Box
				component="img"
				src={ cell.getValue() }
				alt="url"
				sx={ {
				// just show image nice with tooltip corners
					borderRadius: 'var(--urlslab-radius-sm)',
					display: 'block',
					marginY: 0.25,
					maxWidth: '15em',
				} }
			/>,
			cell: ( cell ) => <a href={ cell.row.original.screenshot_url } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: __( 'Screenshot URL' ),
			size: 150,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 150,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => scrStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'update_scr_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 115,
		} ),
		columnHelper?.accessor( 'screenshot_usage_count', {
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
			size: 60,
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
				onDelete={ () => deleteRow( { cell, id: 'url_title' } ) }
			>
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />
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
				{ __( "The table displays a list of URLs that have been requested for screenshots. You can make these requests by using a shortcode or any other element on your page, for example Related Articles. These screenshots are produced by a paid feature offered by the URLsLab Service. Depending on the queue size, it may take anywhere from a few minutes to several days to capture all the screenshots. Once a screenshot is available, it is automatically integrated into your page wherever you've chosen to display it. In the meantime, you can use placeholders or default images, which are easily configurable." ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				options={ { perPage: 1000 } }
			/>
			<Table className="fadeInto"
				initialState={ { columnVisibility: { url_title: false, labels: false } } }
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
