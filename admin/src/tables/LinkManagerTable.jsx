import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
	useInfiniteFetch, ProgressBar, SortBy, Tooltip, LinkIcon, Trash, SingleSelectMenu, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, DateTimeFormat, TagsMenu, Button,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';

export default function LinkManagerTable( { slug } ) {
	const queryClient = useQueryClient();
	const paginationId = 'url_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

	const schedules = useMemo( () => {
		return queryClient.getQueryData( [ 'schedule', 'urls' ] );
	}, [ queryClient ] );

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

	const { selectedRows, selectRow, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();

	const showChanges = ( cell ) => {
		const { http_status, url_name } = cell?.row?.original;
		const domain = url_name.replace( /^(https?:\/\/)([^\/]+)(\/.+?)?$/g, '$2' );
		if ( http_status > 299 || http_status <= 0 || ! schedules.includes( domain ) ) {
			return false;
		}

		return true;
	};

	const setUnifiedPanel = ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );

		setOptions( [ origCell.url_links_count > 0 &&
				{
					detailsOptions: {
						title: `Outgoing Links`, text: `From: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/links`, showKeys: [ { name: 'dest_url_name' } ], listId: 'dest_url_id',
					},
				},
		origCell.url_usage_count > 0 && {
			detailsOptions: {
				title: `Link found in following pages`, text: `Link: ${ origCell.url_name }`, slug, url: `${ origCell.url_id }/linked-from`, showKeys: [ { name: 'src_url_name' } ], listId: 'src_url_id',
			},
		},
		] );
	};

	const httpStatusTypes = {
		'-2': __( 'Processing' ),
		'-1': __( 'Waiting' ),
		200: __( 'Valid' ),
		400: __( 'Client Error' ),
		301: __( 'Moved Permanently' ),
		302: __( 'Found, Moved temporarily' ),
		307: __( 'Temporary Redirect' ),
		308: __( 'Permanent Redirect' ),
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
		url_h1: __( 'H1' ),
		url_meta_description: __( 'Description' ),
		url_summary: __( 'Summary' ),
		http_status: __( 'Status' ),
		labels: __( 'Tags' ),
		// sum_status: __( 'Summary Status' ),
		// update_sum_date: __( 'Summary Updated' ),
		url_links_count: __( 'Outgoing links count' ),
		url_usage_count: __( 'Incoming links count' ),
		visibility: __( 'Visibility' ),
		update_http_date: __( 'Last change' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( val ) => {
				selectRow( val, cell );
			} } />,
			header: null,
		} ),
		columnHelper.accessor( 'url_name', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_name }</SortBy>,
			size: 200,
		} ),
		columnHelper.accessor( 'url_title', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_title }</SortBy>,
			size: 120,
		} ),
		columnHelper.accessor( 'url_h1', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: header.url_h1,
			size: 120,
		} ),
		columnHelper?.accessor( 'url_meta_description', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_meta_description }</SortBy>,
			size: 120,
		} ),
		columnHelper.accessor( 'url_summary', {
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_summary }</SortBy>,
			size: 200,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => httpStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.http_status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'visibility', {
			filterValMenu: visibilityTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu
				items={ visibilityTypes }
				name={ cell.column.id }
				defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.visibility }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.update_http_date }</SortBy>,
			size: 115,
		} ),
		columnHelper.accessor( 'url_links_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 0 );
					} }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_links_count }</SortBy>,
			size: 70,
		} ),
		columnHelper.accessor( 'url_usage_count', {
			cell: ( cell ) => <div className="flex flex-align-center">
				{ cell?.getValue() }
				{ cell?.getValue() > 0 &&
					<button className="ml-s" onClick={ () => {
						setUnifiedPanel( cell );
						activatePanel( 1 );
					} }>
						<LinkIcon />
						<Tooltip>{ __( 'Show URLs where used' ) }</Tooltip>
					</button>
				}
			</div>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_usage_count }</SortBy>,
			size: 70,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'changesPanel', {
			className: 'changesPanel',
			cell: ( cell ) => showChanges( cell ) &&
			<Button onClick={ () => {
				setOptions( { changesPanel: { title: cell.row.original.url_name, slug: `url/${ cell.row.original.url_id }/changes` } } );
				activatePanel( 'changesPanel' );
			} }
			className="small active"
			>
				{ __( 'Show changes' ) }
			</Button>,
			header: null,
			size: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <Trash onClick={ () => deleteRow( { cell, id: 'url_name' } ) } />,
			header: null,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				noImport
				selectedRows={ selectedRows }
				onDeleteSelected={ () => deleteSelectedRows( { id: 'url_name' } ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ {
					header, data, slug, paginationId, url,
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
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
