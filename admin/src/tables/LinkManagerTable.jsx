import { useI18n } from '@wordpress/react-i18n/';

import {
	useInfiniteFetch,
	ProgressBar,
	SortBy,
	Tooltip,
	LinkIcon,
	SingleSelectMenu,
	Checkbox,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	DateTimeFormat,
	TagsMenu,
	Button,
	InputField,
	IconButton,
	RefreshIcon,
	RowActionButtons,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import { langName } from '../lib/helpers';

export default function LinkManagerTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'url_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetching,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, filters, sorting, paginationId } );

	const { selectRows, deleteRow, deleteMultipleRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setOptions, setRowToEdit } = useTablePanels();

	const showChanges = ( cell ) => {
		const { http_status, urlslab_scr_timestamp, urlslab_sum_timestamp } = cell?.row?.original;
		if ( http_status > 299 || http_status <= 0 ) {
			return false;
		}

		return urlslab_scr_timestamp !== 0 || urlslab_sum_timestamp !== 0;
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

	const ActionButton = ( { cell, onClick } ) => {
		const { http_status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					http_status !== '-2' &&
					<IconButton className="mr-s" tooltip={ __( 'Regenerate' ) } tooltipClass="align-left" onClick={ () => onClick( '-2' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const scrStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Active' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
	};

	const sumStatusTypes = {
		N: __( 'Waiting' ),
		A: __( 'Active' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		E: __( 'Error' ),
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

	const header = {
		url_name: __( 'URL' ),
		url_title: __( 'Title' ),
		url_h1: __( 'H1' ),
		url_meta_description: __( 'Description' ),
		url_summary: __( 'Summary' ),
		url_priority: __( 'SEO rank' ),
		http_status: __( 'Status' ),
		scr_status: __( 'Source status' ),
		sum_status: __( 'Summary status' ),
		visibility: __( 'Visibility' ),
		update_http_date: __( 'Last change' ),
		update_scr_date: __( 'Source status change' ),
		update_sum_date: __( 'Summary status change' ),
		url_links_count: __( 'Outgoing links count' ),
		url_usage_count: __( 'Incoming links count' ),
		labels: __( 'Tags' ),
		url_lang: __( 'Language' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ () => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
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
		columnHelper.accessor( 'url_priority', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <InputField type="number" defaultValue={ cell.getValue() } min="0" max="100" onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_priority }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'http_status', {
			filterValMenu: httpStatusTypes,
			cell: ( cell ) => httpStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.http_status }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'scr_status', {
			filterValMenu: scrStatusTypes,
			cell: ( cell ) => scrStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.scr_status }</SortBy>,
			size: 80,
		} ),
		columnHelper?.accessor( 'sum_status', {
			filterValMenu: sumStatusTypes,
			cell: ( cell ) => sumStatusTypes[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.sum_status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'visibility', {
			filterValMenu: visibilityTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu defaultAccept autoClose items={ visibilityTypes } name={ cell.column.id } defaultValue={ cell.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.visibility }</SortBy>,
			size: 100,
		} ),
		columnHelper.accessor( 'update_http_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.update_http_date }</SortBy>,
			size: 115,
		} ),
		columnHelper?.accessor( 'update_scr_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.update_scr_date }</SortBy>,
			size: 115,
		} ),
		columnHelper?.accessor( 'update_sum_date', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.update_sum_date }</SortBy>,
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
		columnHelper.accessor( 'url_lang', {
			className: 'nolimit',
			tooltip: ( cell ) => <Tooltip className="xxl">{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => langName( cell?.getValue() ),
			header: header.url_lang,
			size: 70,
		} ),
		columnHelper.accessor( 'labels', {
			className: 'nolimit',
			cell: ( cell ) => <TagsMenu defaultValue={ cell.getValue() } slug={ slug } onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: header.labels,
			size: 160,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'url_name' } ) }
			>
				{
					showChanges( cell ) &&
					<Button onClick={ () => {
						setOptions( { changesPanel: { title: cell.row.original.url_name, slug: `url/${ cell.row.original.url_id }/changes` } } );
						activatePanel( 'changesPanel' );
					} }
					className="mr-s small active"
					>
						{ __( 'Show changes' ) }
					</Button>
				}
				<ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'http_status', newVal: val, cell } ) } />
			</RowActionButtons>,
			header: null,
			size: 0,
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
				onDeleteSelected={ deleteMultipleRows }
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
				initialState={ { columnVisibility: { scr_status: false, sum_status: false, update_scr_date: false, update_sum_date: false } } }
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
