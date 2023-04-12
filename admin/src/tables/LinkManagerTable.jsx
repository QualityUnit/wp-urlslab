import { useState } from 'react';
import {
	useInfiniteFetch, ProgressBar, Tooltip, LinkIcon, Trash, InputField, SortMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';

export default function LinkManagerTable( { slug } ) {
	const pageId = 'url_id';
	const { table, setTable, filters, setFilters, sortingColumn, sortBy } = useTableUpdater( { slug } );
	const url = `${ filters }${ sortingColumn || '&sort_column=url_name&sort_direction=ASC' }`;

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
	} = useInfiniteFetch( { key: slug, url, pageId } );

	const { row, selectRow, deleteRow, updateRow } = useChangeRow( { data, url, slug, pageId } );

	// const sumStatusTypes = {
	// 	N: __( 'Waiting' ),
	// 	A: __( 'Processed' ),
	// 	P: __( 'Pending' ),
	// 	U: __( 'Updating' ),
	// 	E: __( 'Error' ),
	// };

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
		http_status: __( 'Status' ),
		// sum_status: __( 'Summary Status' ),
		// update_sum_date: __( 'Summary Updated' ),
		url_links_count: __( 'Outgoing links count' ),
		url_usage_count: __( 'Incoming links count' ),
		visibility: __( 'Visibility' ),
		url_type: __( 'URL Type' ),
		update_http_date: __( 'Status Updated' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: header.url_name,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.url_title,
			size: 150,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.url_meta_description,
			size: 100,
		} ),
		columnHelper.accessor( 'url_summary', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.url_summary,
			size: 150,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ httpStatusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.http_status,
			size: 100,
		} ),
		columnHelper.accessor( 'visibility', {
			filterValMenu: visibilityTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ visibilityTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.visibility,
			size: 100,
		} ),
		columnHelper.accessor( 'url_type', {
			filterValMenu: urlTypes,
			className: 'nolimit',
			cell: ( cell ) => <SortMenu
				items={ urlTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.url_type,
			size: 100,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( val ) => new Date( val?.getValue() ).toLocaleString( window.navigator.language ),
			header: () => header.update_http_date,
			size: 140,
		} ),
		columnHelper.accessor( 'url_links_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Outgoing Links`, text: `From: ${ cell.row.original.url_name }`, slug, url: `${ cell.row.original.url_id }/links`, showKeys: [ 'dest_url_name' ], listId: 'dest_url_id',
					} ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: () => header.url_links_count,
			size: 140,
		} ),
		columnHelper.accessor( 'url_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => setDetailsOptions( {
						title: `Link found in following pages`, text: `Link: ${ cell.row.original.url_name }`, slug, url: `${ cell.row.original.url_id }/linked-from`, showKeys: [ 'src_url_name' ], listId: 'src_url_id',
					} ) }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: () => header.url_usage_count,
			size: 140,
		} ),
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
				// defaultSortBy="url_name&ASC"
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
				<TooltipSortingFiltering props={ { isFetching, filters, sortingColumn } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
