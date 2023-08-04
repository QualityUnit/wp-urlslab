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
		const row = tableElem.row?.original || tableElem.original || tableElem;
		if ( optionalSelector ) {
			return `${ row[ paginationId ] }/${ row[ optionalSelector ] }`;
		}
		return row[ paginationId ];
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
			const { editedRow, newVal, cell, customEndpoint, changeField, optionalSelector, id } = opts;

			// Updating one cell value only
			if ( newVal !== undefined ) {
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
		if ( newVal === undefined ) { // Editing whole row = parameters are preset
			setRowToEdit( cell.row.original );
			return false;
		}
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, optionalSelector, id, updateAll } );
	};

	const saveEditedRow = ( { editedRow, id, updateAll } ) => {
		updateRowData.mutate( { editedRow, id, updateAll } );
	};

	// Remove rows from loaded table for optimistic update used in setQueryData
	const processDeletedPages = useCallback( ( rowData ) => {
		let deletedPagesArray = data?.pages;

		if ( ! Array.isArray( rowData ) ) {
			deletedPagesArray = deletedPagesArray.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( rowData ) ) ) ?? [];

			return deletedPagesArray;
		}

		rowData.forEach( ( singleRow ) => {
			deletedPagesArray = deletedPagesArray.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( singleRow ) ) ) ?? [];
		} );

		return deletedPagesArray;
	}, [ data?.pages, getRowId, paginationId ] );

	//Main mutate function handling deleting, optimistic updates and error/success notifications
	const deleteSelectedRow = useMutation( {
		mutationFn: async ( opts ) => {
			const { deletedPagesArray, rowData, optionalSelector, id, updateAll } = opts;
			let idArray = [];

			// Optimistic update of table to immediately delete rows before delete request passed in database
			queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
				pages: deletedPagesArray,
				pageParams: origData.pageParams,
			} ) );

			// Single row delete
			if ( ! Array.isArray( rowData ) ) {
				const row = rowData.row || rowData;

				// Shows notification for single row to delete
				setNotification( slug, {
					message: `Deleting row${ id ? ' “' + row.original[ id ] + '”' : '' }…`, status: 'info',
				} );

				// sending only one object in array for single row
				const response = await del( slug, [ { [ paginationId ]: row.original[ paginationId ], [ optionalSelector ]: row.original[ optionalSelector ] } ] ); // Sends array of ONE  row  as object with ID and optional ID to slug/delete endpoint
				return { response, id: row.original[ id ], updateAll };
			}

			// Multiple rows delete
			rowData.forEach( ( singleRow ) => {
				const row = singleRow.original || singleRow;
				idArray = [ ...idArray, { [ paginationId ]: row[ paginationId ], [ optionalSelector ]: row[ optionalSelector ] } ];
			} );

			setNotification( slug, {
				message: `Deleting multiple rows…`, status: 'info',
			} );

			const response = await del( slug, idArray ); // Sends array of object of row IDs and optional IDs to slug/delete endpoint
			return { response, updateAll };
		},
		onSuccess: ( { response, id, updateAll } ) => {
			const { ok } = response;

			if ( ok ) {
				//If id present, single row sentence (Row Id has been deleted) else show Rows have been deleted
				setNotification( slug, { message: `${ id ? 'Row “' + id + '” has' : 'Rows have' } been deleted`, status: 'success' } );
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
				//If id present, single row sentence (Deleting row Id failed) else show Deleting of some rows failed
				setNotification( slug, { message: `Deleting ${ id ? 'row “' + id + '”' : 'of some rows' } failed`, status: 'error' } );
			}
		},
	} );

	// Single row delete call used from table
	const deleteRow = ( { cell, optionalSelector, id, updateAll } ) => {
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), rowData: cell, optionalSelector, id, updateAll } );
	};

	// Multiple rows delete used from table
	const deleteMultipleRows = ( options ) => {
		const { optionalSelector, rowsToDelete, updateAll } = options || {};

		if ( ! rowsToDelete ) {
			const selectedRowsInTable = table?.getSelectedRowModel().flatRows || [];
			table?.toggleAllPageRowsSelected( false );

			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( selectedRowsInTable ), rowData: selectedRowsInTable, optionalSelector, updateAll } );
			return false;
		}

		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( rowsToDelete ), rowData: rowsToDelete, optionalSelector, updateAll } );
	};

	// Function for row selection from table
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

	const clearRows = () => {
		setSelectedRows( [ ] );
	};

	return { selectedRows, insertRow, selectRows, deleteRow, clearRows, deleteMultipleRows, updateRow, saveEditedRow };
}
