import { useCallback, useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { postFetch } from '../api/fetching';
import filtersArray from '../lib/filtersArray';
import useTablePanels from './useTablePanels';
import { setNotification } from './useNotifications';

export default function useChangeRow( { data, url, slug, paginationId } ) {
	const queryClient = useQueryClient();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const [ table, setTable ] = useState( );
	const [ selectedRows, setSelectedRows ] = useState( [] );
	let rowIndex = 0;

	const { filters, sorting = [] } = url || {};

	useEffect( () => {
		if ( table && ! table.getSelectedRowModel().flatRows.length ) {
			setTable();
		}
	}, [ table ] );

	const getRowId = useCallback( ( tableElem, optionalSelector ) => {
		const row = tableElem.row || tableElem;
		if ( optionalSelector ) {
			return `${ row.original[ paginationId ] }/${ row.original[ optionalSelector ] }`;
		}
		return row.original[ paginationId ];
	}, [ paginationId ] );

	const insertNewRow = useMutation( {
		mutationFn: async ( { editedRow, updateAll } ) => {
			setNotification( slug, { message: 'Adding row…', status: 'info' } );
			const response = await postFetch( `${ slug }/create`, editedRow );
			return { response, updateAll };
		},
		onSuccess: async ( { response, updateAll } ) => {
			const { ok } = await response;
			if ( ok ) {
				if ( updateAll ) {
					queryClient.invalidateQueries( [ slug ] );
				}
				if ( ! updateAll ) {
					queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				}
				setNotification( slug, { message: 'Row has been added', status: 'success' } );
				return false;
			}
			setNotification( slug, { message: 'Adding row failed', status: 'error' } );
		},
	} );
	const insertRow = ( { editedRow, updateAll } ) => {
		insertNewRow.mutate( { editedRow, updateAll } );
	};

	const updateRowData = useMutation( {
		mutationFn: async ( opts ) => {
			const { editedRow, newVal, cell, customEndpoint, changeField, optionalSelector, id, updateAll } = opts;

			// Updating one cell value only
			if ( newVal ) {
				setNotification( slug, { message: `Updating row${ id ? ' “' + cell.row.original[ id ] + '”' : '' }…`, status: 'info' } );
				const cellId = cell.column.id;
				const newPagesArray = data?.pages.map( ( page ) =>

					page.map( ( row ) => {
						if ( row[ paginationId ] === getRowId( cell ) ) {
							row[ cellId ] = newVal;
							return row;
						}
						return row;
					}
					),
				) ?? [];

				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
					pages: newPagesArray,
					pageParams: origData.pageParams,
				} ) );

				// Called from another field, ie in Generator status
				if ( changeField ) {
					const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, { [ changeField ]: newVal } );
					return { response, id: cell.row.original[ id ] };
				}
				const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, { [ cellId ]: newVal } );
				return { response, id: cell.row.original[ id ] };
			}

			// // // Updating whole row via edit panel
			const paginateArray = data?.pages;
			let newPagesArray = [];
			if ( paginateArray && editedRow ) {
				setNotification( slug, { message: `Updating row${ id ? ' “' + editedRow[ id ] + '”' : '' }…`, status: 'info' } );
				newPagesArray = paginateArray.map( ( page ) =>

					page.map( ( row ) => {
						if ( row[ paginationId ] === editedRow[ paginationId ] ) {
							return editedRow;
						}
						return row;
					}
					),
				) ?? [];
				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
					pages: newPagesArray,
					pageParams: origData.pageParams,
				} ) );
			}

			if ( ! paginateArray && data && editedRow ) {
				setNotification( slug, { message: `Updating row${ id ? ' “' + editedRow[ id ] + '”' : '' }…`, status: 'info' } );
				newPagesArray = data?.map( ( row ) => {
					if ( row[ paginationId ] === editedRow[ paginationId ] ) {
						return editedRow;
					}
					return row;
				} ) ?? [];
				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => {
					return origData;
				} );

				const response = await postFetch( `${ slug }/${ editedRow[ paginationId ] }`, editedRow );
				return { response, editedRow, id: editedRow[ id ] };
			}
		},
		onSuccess: ( { response, id, updateAll } ) => {
			const { ok } = response;
			if ( ok ) {
				setNotification( slug, { message: `Row${ id ? ' “' + id + '”' : '' } has been updated`, status: 'success' } );
				if ( ! updateAll ) {
					queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				}
				if ( updateAll ) {
					queryClient.invalidateQueries( [ slug ] );
				}
			}
		},
	} );

	const updateRow = ( { newVal, cell, customEndpoint, changeField, optionalSelector, id, updateAll } ) => {
		if ( ! newVal ) { // Editing whole row = parameters are preset
			setRowToEdit( cell.row.original );
			return false;
		}
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, optionalSelector, id, updateAll } );
	};

	const saveEditedRow = ( { editedRow, id, updateAll } ) => {
		updateRowData.mutate( { editedRow, id, updateAll } );
	};

	const processDeletedPages = useCallback( ( tableElem ) => {
		let deletedPagesArray = data?.pages;

		deletedPagesArray = deletedPagesArray.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( tableElem ) ) ) ?? [];

		return deletedPagesArray;
	}, [ data?.pages, getRowId, paginationId ] );

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( opts ) => {
			const { deletedPagesArray, cell, optionalSelector, id, updateAll } = opts;
			const row = cell.row || cell;

			setNotification( slug, {
				message: `Deleting row${ id ? ' “' + row.original[ id ] + '”' : '' }…`, status: 'info',
			} );

			queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
				pages: deletedPagesArray,
				pageParams: origData.pageParams,
			} ) );

			const response = await del( `${ slug }/${ getRowId( cell, optionalSelector ) }` );
			return { response, id: row.original[ id ], updateAll };
		},
		onSuccess: ( { response, id, updateAll } ) => {
			const { ok } = response;
			if ( ok ) {
				setNotification( slug, { message: `Row${ id ? ' “' + id + '”' : '' } has been deleted`, status: 'success' } );
				rowIndex += 1;
			}

			if ( rowIndex === 1 ) {
				setTable();
				if ( ! updateAll ) {
					queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
					queryClient.invalidateQueries( [ slug, 'count' ] );
					return false;
				}
				queryClient.invalidateQueries( [ slug ] );
				queryClient.invalidateQueries( [ slug, 'count' ] );
			}

			if ( ! ok ) {
				setNotification( slug, { message: `Deleting row${ id ? ' “' + id + '”' : '' } failed`, status: 'error' } );
			}
		},
	} );

	const deleteRow = useCallback( ( { cell, optionalSelector, id, updateAll } ) => {
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), cell, optionalSelector, id, updateAll } );
	}, [ processDeletedPages, deleteSelectedRow ] );

	const deleteSelectedRows = async ( { optionalSelector, id } ) => {
		// Multiple rows delete
		const selectedRowsInTable = table?.getSelectedRowModel().flatRows || [];
		table?.toggleAllPageRowsSelected( false );

		selectedRowsInTable.map( ( row ) => {
			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( row ), cell: row, optionalSelector, id } );
			return false;
		} );
	};

	const selectRows = ( tableElem, remove = false ) => {
		if ( tableElem && ! remove ) {
			setTable( tableElem?.table );
			setSelectedRows( ( prevSelectedRows ) => [ ...prevSelectedRows, tableElem ] );
			return false;
		}
		if ( remove ) {
			setTable( tableElem?.table );
			setSelectedRows( selectedRows.filter( ( item ) => item.row.id !== tableElem.row.id ) );
			return false;
		}
		setTable();
	};

	return { selectedRows, insertRow, selectRows, deleteRow, deleteSelectedRows, updateRow, saveEditedRow };
}
