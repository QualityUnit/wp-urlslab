/* eslint-disable indent */
import {
	useInfiniteFetch, ProgressBar, SortBy, SingleSelectMenu, CountryMenu, LangMenu, InputField, Checkbox, LinkIcon, Trash, Loader, Tooltip, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, Edit, SuggestInputField,
} from '../lib/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';
import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import IconButton from '../elements/IconButton';
import React, { useCallback } from 'react';
import {countriesList, langName} from "../lib/helpers";
import TextArea from "../elements/Textarea";
import { ReactComponent as DisableIcon } from '../assets/images/icons/icon-disable.svg';
import { ReactComponent as RefreshIcon } from '../assets/images/icons/icon-refresh.svg';

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



	const ActionButton = ( { cell, onClick } ) => {
		const { status } = cell?.row?.original;

		return (
			<div className="flex flex-align-center flex-justify-end">
				{
					( status !== 'E' && status !== 'P' ) &&
					<IconButton className="mr-s c-saturated-red" tooltip={ __( 'Disable' ) } tooltipClass="align-left" onClick={ () => onClick( 'E' ) }>
						<DisableIcon />
					</IconButton>
				}
				{
					( status !== 'P' ) &&
					<IconButton className="mr-s" tooltip={ __( 'Process again' ) } tooltipClass="align-left" onClick={ () => onClick( 'X' ) }>
						<RefreshIcon />
					</IconButton>
				}
			</div>
		);
	};

	const statuses = {
		'X': __( 'Not processed' ),
		'P': __( 'Processing' ),
		'A': __( 'Processed' ),
		'E': __( 'Disabled' ),
		'S': __( 'Irrelevant' ),
	};

	const types = {
		U: __( 'User' ),
		S: __( 'Suggested' ),
	}

	const header = {
		query: __( 'Query' ),
		lang: __( 'Language' ),
		country: __( 'Country' ),
		updated: __( 'Updated' ),
		status: __( 'Status' ),
		type: __( 'Type' ),
		best_position: __( 'My Position' ),
		url_name: __( 'My URL' ),
	};

	const rowEditorCells = {
		query: <TextArea autoFocus liveUpdate defaultValue="" label={ __( 'Queries' ) } rows={ 10 } allowResize onChange={ ( val ) => setRowToEdit( { ...rowToEdit, query: val } ) } required  description={ __( 'SERP queries separated by new line' ) } />,
		lang: <LangMenu autoClose defaultValue="en"	onChange={ ( val ) => setRowToEdit( { ...rowToEdit, lang: val } ) }>{ header.lang }</LangMenu>,
		country: <CountryMenu autoClose defaultValue="us" onChange={ ( val ) => setRowToEdit( { ...rowToEdit, country: val } ) }>{ header.country }</CountryMenu>,
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
			cell: ( cell ) => langName( cell.getValue() ),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.lang }</SortBy>,
			size: 50,
		} ),
		columnHelper.accessor( 'country', {
			className: 'nolimit',
			cell: ( cell ) => {
				if (countriesList[ cell.getValue() ]) {
					return countriesList[ cell.getValue() ];
				}
				return cell.getValue();
				},
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
		columnHelper.accessor( 'type', {
			filterValMenu: types,
			className: 'nolimit',
			cell: ( cell ) => types[ cell.getValue() ],
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.type }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'best_position', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.best_position }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'url_name', {
			className: 'nolimit',
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy props={ { header, sorting, th, onClick: () => sortBy( th ) } }>{ header.url_name }</SortBy>,
			size: 80,
		} ),
		columnHelper.accessor( 'actions', {
			className: 'actions hoverize nolimit',
			cell: ( cell ) => <ActionButton cell={ cell } onClick={ ( val ) => updateRow( { changeField: 'status', newVal: val, cell } ) } />,
			header: null,
			size: 70,
		} ),

		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				return (
					<div className="flex">
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
