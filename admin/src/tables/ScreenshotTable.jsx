import { useMemo } from 'react';
import {
	useInfiniteFetch, handleSelected, Tooltip, Trash, MenuInput, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function ScreenshotTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = useMemo( () => `${ filters }${ sortingColumn }`, [ filters, sortingColumn ] );
	const pageId = 'url_id';

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

	const scrStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Processed' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
	};

	const header = {
		screenshot_url: __( 'Screenshot' ),
		scr_status: __( 'Screenshot Status' ),
		update_scr_date: __( 'Screenshot Updated' ),
		url_name: __( 'URL' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper?.accessor( 'screenshot_url', {
			className: 'thumbnail',
			cell: ( image ) => image?.getValue()
				? <a href={ image?.getValue() } target="_blank" rel="noreferrer"><img src={ image?.getValue() } alt={ image.row.original.url_name } /></a>
				: <div className="img"></div>,
			header: () => header.screenshot_url,
			size: 90,
		} ),
		columnHelper?.accessor( 'scr_status', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ scrStatusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ scrStatusTypes } name={ cell.column.id } checkedId={ currentFilters.scr_status || '' } onChange={ ( val ) => addFilter( 'scr_status', val ) }>{ header.scr_status }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'update_scr_date', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => header.update_scr_date,
			size: 140,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter URL Desc" defaultValue={ currentFilters.url_name } onChange={ ( val ) => addFilter( 'url_name', val ) }>{ header.url_name }</MenuInput>,
			size: 400,
		} ),
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) } />,
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
				currentFilters={ currentFilters }
				header={ header }
				removeFilters={ ( key ) => removeFilters( key ) }
				onSort={ ( val ) => sortBy( val ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: `from_${ pageId }`,
					pageId,
					deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
					perPage: 1000,
				} }
			/>
			<Table className="fadeInto" columns={ columns }
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
