import {
	useInfiniteFetch, handleSelected, Trash, Button, InputField, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function LinkManagerTable( { slug } ) {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilter, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
	const pageId = 'urlMd5';

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
		urlTitle: __( 'URL Title' ),
		urlMetaDescription: __( 'URL Description' ),
		screenshot_url: __( 'Screenshot' ),
		status: __( 'Status' ),
		urlName: __( 'URL' ),
		urlSummary: __( 'URL Summary' ),
		visibility: __( 'Visibility' ),
		updateStatusDate: __( 'Status Date' ),
		urlCheckDate: __( 'Check Date' ),
	};

	const columns = [
		columnHelper.accessor( 'delete', {
			className: 'deleteRow',
			cell: ( cell ) => <Button danger onClick={ () => deleteRow( { data, url, slug, cell, rowSelector: pageId } ) }><Trash /></Button>,
			header: () => __( '' ),
			enableResizing: false,
			maxSize: 0,
			size: 0,
		} ),
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
			enableResizing: false,
			maxSize: 24,
			size: 24,
		} ),
		columnHelper?.accessor( 'screenshot_url', {
			className: 'thumbnail',
			cell: ( image ) => image?.getValue()
				? <a href={ image?.getValue() } target="_blank" rel="noreferrer"><img src={ image?.getValue() } alt={ image.row.original.urlName } /></a>
				: <div className="img"></div>,
			header: () => header.screenshot_url,
		} ),
		columnHelper.accessor( 'urlTitle', {
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => header.urlTitle,
			minSize: 250,
		} ),
		columnHelper?.accessor( 'urlMetaDescription', {
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => header.urlMetaDescription,
			minSize: 150,
		} ),
		columnHelper.accessor( 'urlSummary', {
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => header.urlSummary,
			minSize: 150,
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			className: 'youtube-status',
			header: () => header.status,
		} ),
		columnHelper.accessor( 'updateStatusDate', {
			header: () => header.updateStatusDate,
			minSize: 150,
		} ),
		columnHelper.accessor( 'visibility', {
			cell: ( cell ) => <SortMenu
				items={ visibilityTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { data, newVal, url, slug, cell, rowSelector: pageId } ) } />,
			header: () => header.visibility,
		} ),
		columnHelper.accessor( 'urlName', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" className="limit-100" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => header.urlName,
			enableResizing: false,
			minSize: 350,
		} ),
		columnHelper.accessor( 'urlCheckDate', {
			header: () => header.urlCheckDate,
			minSize: 150,
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
				removedFilter={ ( key ) => removeFilter( key ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_urlMd5',
					pageId: 'urlMd5',
					deleteCSVCols: [ 'urlId', 'urlMd5', 'domainId' ],
					perPage: 1000,
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			{ tableHidden
				? null
				: <Table className="fadeInto" columns={ columns }
					resizable
					data={
						isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
					}
				>
					<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
				</Table>
			}
		</>
	);
}
