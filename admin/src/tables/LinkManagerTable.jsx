import {
	useInfiniteFetch, handleSelected, Tooltip, Trash, MenuInput, InputField, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function LinkManagerTable( { slug } ) {
	const { setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, row, deleteRow, updateRow } = useTableUpdater();

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

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Active' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		B: __( 'Not crawling' ),
		X: __( 'Blocked' ),
	};

	const visibilityTypes = {
		V: __( 'Visible' ),
		H: __( 'Hidden' ),
	};

	const header = {
		url_title: __( 'URL Title' ),
		url_meta_description: __( 'URL Description' ),
		screenshot_url: __( 'Screenshot' ),
		status: __( 'Status' ),
		url_name: __( 'URL' ),
		url_summary: __( 'URL Summary' ),
		visibility: __( 'Visibility' ),
		update_scr_date: __( 'Screenshot Updated' ),
		update_http_date: __( 'HTTP Status Checked' ),
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
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter URL Title" defaultValue={ currentFilters.url_title } onChange={ ( val ) => addFilter( 'url_title', val ) }>{ header.urlTitle }</MenuInput>,
			size: 150,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter URL Desc" defaultValue={ currentFilters.url_meta_description } onChange={ ( val ) => addFilter( 'urlFilter', val ) }>{ header.urlMetaDescription }</MenuInput>,
			size: 200,
		} ),
		columnHelper.accessor( 'url_summary', {
			className: 'nolimit',
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => <MenuInput isFilter placeholder="Enter Text" defaultValue={ currentFilters.url_summary } onChange={ ( val ) => addFilter( 'url_summary', val ) }>{ header.urlSummary }</MenuInput>,
			size: 150,
		} ),
		columnHelper?.accessor( 'scr_status', {
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: ( cell ) => <SortMenu isFilter items={ statusTypes } name={ cell.column.id } checkedId={ currentFilters.status || '' } onChange={ ( val ) => addFilter( 'scr_status', val ) }>{ header.status }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'update_scr_date', {
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
			header: ( cell ) => <SortMenu isFilter items={ visibilityTypes } name={ cell.column.id } checkedId={ currentFilters.visibility || '' } onChange={ ( val ) => addFilter( 'scr_status', val ) }>{ header.visibility }</SortMenu>,
			size: 100,
		} ),
		columnHelper.accessor( 'url_name', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter URL Desc" defaultValue={ currentFilters.url_name } onChange={ ( val ) => addFilter( 'url_name', val ) }>{ header.url_name }</MenuInput>,
			size: 250,
		} ),
		columnHelper.accessor( 'update_http_date', {
			header: () => header.update_http_date,
			size: 140,
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
				removeFilters={ ( array ) => removeFilters( array ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_url_id',
					pageId: 'url_id',
					deleteCSVCols: [ 'urlslab_url_id', 'url_id', 'urlslab_domain_id' ],
					perPage: 1000,
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
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
