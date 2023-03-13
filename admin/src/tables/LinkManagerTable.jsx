import {
	useInfiniteFetch, handleSelected, Tooltip, Trash, MenuInput, InputField, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function LinkManagerTable( { slug } ) {
	const { filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
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

	const sumStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Processed' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
	};

	const httpStatusTypes = {
		'-2': __( 'Processing' ),
		'-1': __( 'Waiting' ),
		200: __( 'Valid' ),
		400: __( 'Client Error' ),
		404: __( 'Not Found' ),
		500: __( 'Server Error' ),
		503: __( 'Server Error' ),
	};

	const visibilityTypes = {
		V: __( 'Visible' ),
		H: __( 'Hidden' ),
	};

	const urlTypes = {
		I: __( 'Internal' ),
		E: __( 'External' ),
	};

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_meta_description: __( 'Description' ),
		url_summary: __( 'Summary' ),
		screenshot_url: __( 'Screenshot' ),
		http_status: __( 'HTTP Status' ),
		sum_status: __( 'Summary Status' ),
		scr_status: __( 'Screenshot Status' ),
		visibility: __( 'Visibility' ),
		url_type: __( 'URL Type' ),
		update_scr_date: __( 'Screenshot Updated' ),
		update_sum_date: __( 'Summary Updated' ),
		update_http_date: __( 'HTTP Status Updated' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter URL Desc" defaultValue={ currentFilters.url_name } onChange={ ( val ) => addFilter( 'url_name', val ) }>{ header.url_name }</MenuInput>,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter URL Title" defaultValue={ currentFilters.url_title } onChange={ ( val ) => addFilter( 'url_title', val ) }>{ header.url_title }</MenuInput>,
			size: 150,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter URL Desc" defaultValue={ currentFilters.url_meta_description } onChange={ ( val ) => addFilter( 'urlFilter', val ) }>{ header.url_meta_description }</MenuInput>,
			size: 100,
		} ),
		columnHelper.accessor( 'url_summary', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter Text" defaultValue={ currentFilters.url_summary } onChange={ ( val ) => addFilter( 'url_summary', val ) }>{ header.url_summary }</MenuInput>,
			size: 150,
		} ),
		columnHelper?.accessor( 'sum_status', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ sumStatusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ sumStatusTypes } name={ cell.column.id } checkedId={ currentFilters.sum_status || '' } onChange={ ( val ) => addFilter( 'sum_status', val ) }>{ header.sum_status }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'update_sum_date', {
			className: 'nolimit',
			header: () => header.update_scr_date,
			size: 120,
		} ),
		columnHelper?.accessor( 'http_status', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ httpStatusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ httpStatusTypes } name={ cell.column.id } checkedId={ currentFilters.http_status || '' } onChange={ ( val ) => addFilter( 'http_status', val ) }>{ header.http_status }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'update_http_date', {
			header: () => header.update_scr_date,
			size: 140,
		} ),
		columnHelper.accessor( 'visibility', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ visibilityTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ visibilityTypes } name={ cell.column.id } checkedId={ currentFilters.visibility || '' } onChange={ ( val ) => addFilter( 'visibility', val ) }>{ header.visibility }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'url_type', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ urlTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ urlTypes } name={ cell.column.id } checkedId={ currentFilters.url_type || '' } onChange={ ( val ) => addFilter( 'url_type', val ) }>{ header.url_type }</SortMenu>,
			size: 100,
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
