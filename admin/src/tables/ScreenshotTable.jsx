import { useMemo, useState } from 'react';
import {
	useInfiniteFetch, Tooltip, Trash, LinkIcon, InputField, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function ScreenshotTable( { slug } ) {
	const pageId = 'url_id';

	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );

	const url = useMemo( () => `${ filters }${ sortingColumn || '&sort_column=url_name&sort_direction=ASC' }`, [ filters, sortingColumn ] );
	const [ detailsOptions, setDetailsOptions ] = useState( null );

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	const scrStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Awailable' ),
		P: __( 'Pending' ),
		E: __( 'Disabled' ),
	};
	const scrScheduleTypes = {
		N: 'New',
		M: 'Manual',
		S: 'Scheduled',
		E: 'Error',
	};

	const header = {
		screenshot_url: __( 'Screenshot URL' ),
		url_name: __( 'Destination URL' ),
		url_title: __( 'Title' ),
		scr_status: __( 'Status' ),
		scr_schedule: __( 'Schedule' ),
		screenshot_usage_count: __( 'Usage' ),
		update_scr_date: __( 'Updated at' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'screenshot_url', {
			className: 'thumbnail',
			cell: ( image ) => image?.getValue()
				? <a href={ image?.getValue() } target="_blank" rel="noreferrer"><img src={ image?.getValue() } alt={ image.row.original.url_name } /></a>
				: <div className="img"></div>,
			header: __( 'Thumbnail' ),
			size: 90,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.url_name,
			size: 250,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.url_title,
			size: 200,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ scrStatusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.scr_status,
			size: 100,
		} ),
		columnHelper.accessor( 'scr_schedule', {
			filterValMenu: scrScheduleTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ scrScheduleTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.scr_schedule,
			size: 100,
		} ),
		columnHelper?.accessor( 'screenshot_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Screenshot used on these URLs`, slug, url: `${ cell.row.original.url_id }/linked-from`, showKeys: [ 'url_name' ], listId: 'screenshot_url_id',
					} ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: header.screenshot_usage_count,
			size: 100,
		} ),
		// columnHelper.accessor( 'update_scr_date', {
		// 	cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
		// 	header: header.update_scr_date,
		// 	size: 140,
		// } ),

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
				onSort={ ( val ) => sortBy( val ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				noImport
				detailsOptions={ detailsOptions }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
					perPage: 1000,
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
			>
				{ row
					? <Tooltip center>{ `${ header.url_name } “${ row.url_name }”` } has been deleted.</Tooltip>
					: null
				}
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
