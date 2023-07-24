/* eslint-disable indent */
import {
	useInfiniteFetch, ProgressBar, TagsMenu, SortBy, SingleSelectMenu, CountryMenu, LangMenu, InputField, Checkbox, LinkIcon, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, Edit, SuggestInputField,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import IconButton from '../elements/IconButton';
import { useCallback } from 'react';

export default function SerpQueriesTable( { slug } ) {
	const paginationId = 'query_id';
	const { table, setTable, filters, setFilters, sorting, sortBy } = useTableUpdater( { slug } );
	const url = { filters, sorting };

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

	const { selectRows, deleteRow, deleteSelectedRows, updateRow } = useChangeRow( { data, url, slug, paginationId } );

	const { activatePanel, setRowToEdit, setOptions } = useTablePanels();
	const rowToEdit = useTablePanels( ( state ) => state.rowToEdit );

	const setUnifiedPanel = useCallback( ( cell ) => {
		const origCell = cell?.row.original;
		setOptions( [] );
		setRowToEdit( {} );
		updateRow( { cell, id: 'keyword' } );
	}, [ setOptions, setRowToEdit, slug, updateRow ] );

	const statuses = {
		'': __( 'Not processed' ),
		'N': __( 'Not approved' ),
		'P': __( 'Processing' ),
		'A': __( 'Processed' ),
		'E': __( 'Failed' ),
		'S': __( 'Skipped' ),
	};

	const header = {
		query: __( 'Query' ),
		lang: __( 'Language' ),
		country: __( 'Country' ),
		updated: __( 'Updated' ),
		status: __( 'Status' ),
	};

	const rowEditorCells = {
		query: <InputField autoFocus liveUpdate defaultValue="" label={ header.query } onChange={ ( val ) => setRowToEdit( { ...rowToEdit, query: val } ) } required
							description={ __( 'SERP query' ) } />,
		lang: <LangMenu autoClose defaultValue="en"
						onChange={ ( val ) => setRowToEdit( { ...rowToEdit, lang: val } ) }>{ header.lang }</LangMenu>,
		country: <CountryMenu autoClose defaultValue="us"
						onChange={ ( val ) => setRowToEdit( { ...rowToEdit, country: val } ) }>{ header.country }</CountryMenu>,
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ cell.row.getIsSelected() } onChange={ ( ) => {
				cell.row.toggleSelected();
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
				selectRows( val ? head : undefined );
			} } />,
			enableResizing: false,
		} ),
		columnHelper.accessor( 'query', {
			tooltip: ( cell ) => <Tooltip>{ cell.getValue() }</Tooltip>,
			cell: ( cell ) => <strong>{ cell.getValue() }</strong>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.query }</SortBy>,
			minSize: 200,
		} ),
		columnHelper.accessor( 'lang', {
			className: 'nolimit',
			cell: ( cell ) => <LangMenu defaultValue={ cell?.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'query' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.lang }</SortBy>,
			size: 50,
		} ),
		columnHelper.accessor( 'country', {
			className: 'nolimit',
			cell: ( cell ) => <CountryMenu defaultValue={ cell?.getValue() } onChange={ ( newVal ) => updateRow( { newVal, cell, id: 'query' } ) } />,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.country }</SortBy>,
			size: 50,
		} ),
		columnHelper.accessor( 'updated', {
			className: 'nolimit',
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.updated }</SortBy>,
			size: 30,
		} ),
		columnHelper.accessor( 'status', {
			filterValMenu: statuses,
			className: 'nolimit',
			cell: ( cell ) => statuses[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.status }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
						<IconButton
							onClick={ () => {
								setUnifiedPanel( cell );
								activatePanel( 'rowEditor' );
							} }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Edit' ) }
						>
							<Edit />
						</IconButton>
						<IconButton
							className="ml-s"
							onClick={ () => deleteRow( { cell, id: 'query' } ) }
							tooltipClass="align-left xxxl"
							tooltip={ __( 'Delete row' ) }
					>
							<Trash />
						</IconButton>
					</div>
				);
			},
			header: null,
			size: 60,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				table={ table }
				onDeleteSelected={ () => deleteSelectedRows( { id: 'query' } ) }
				onFilter={ ( filter ) => setFilters( filter ) }
				options={ { header, data, slug, paginationId, url,
					title: __( 'Add Query' ), id: 'query',
					rowToEdit,
					rowEditorCells,
					deleteCSVCols: [ paginationId, 'dest_url_id' ] }
				}
			/>
			<Table className="fadeInto"
				slug={ slug }
				returnTable={ ( returnTable ) => setTable( returnTable ) }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<TooltipSortingFiltering props={ { isFetching, filters, sorting } } />
				<div ref={ ref }>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</div>
			</Table>
		</>
	);
}
