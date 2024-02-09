import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteRow as del } from '../api/deleteTableData';
import { handleApiError, postFetch } from '../api/fetching';
import { filtersArray } from './useFilteringSorting';
import useTablePanels from './useTablePanels';
import { setNotification } from './useNotifications';
import useTableStore from './useTableStore';
import useSelectRows from './useSelectRows';

export default function useChangeRow( { customSlug } = {} ) {
	const queryClient = useQueryClient();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
	const activatePanel = useTablePanels( ( state ) => state.activatePanel );
	const editedTableSlug = useTablePanels( ( state ) => state.otherTableSlug );
	const editedTableRowId = useTablePanels( ( state ) => state.otherTableRowId );

	let slug = useTableStore( ( state ) => state.activeTable );
	const originSlug = slug;

	if ( customSlug && ! editedTableSlug ) {
		slug = customSlug;
	}
	if ( editedTableSlug ) {
		slug = editedTableSlug;
	}
	const data = useTableStore( ( state ) => state.tables[ slug ]?.data );
	let paginationId = useTableStore( ( state ) => state.tables[ slug ]?.paginationId );

	if ( editedTableSlug ) {
		paginationId = editedTableRowId;
	}

	const optionalSelector = useTableStore( ( state ) => state.tables[ slug ]?.optionalSelector );
	const setSelectedRows = useSelectRows( ( state ) => state.setSelectedRows );
	const setSelectedAll = useSelectRows( ( state ) => state.setSelectedAll );
	const deselectAllRows = useSelectRows( ( state ) => state.deselectAllRows );

	const filters = useTableStore().useFilters( slug );
	const fetchOptions = useTableStore().useFetchOptions( slug );
	const sorting = useTableStore().useSorting( slug );
	const relatedQueries = useTableStore().useRelatedQueries( slug );

	let rowIndex = 0;

	const getRowId = useCallback( ( tableElem ) => {
		const row = tableElem.row?.original || tableElem.original || tableElem;
		if ( optionalSelector ) {
			return `${ row[ paginationId ] }/${ row[ optionalSelector ] }`;
		}
		return row[ paginationId ];
	}, [ optionalSelector, paginationId ] );

	const insertNewRow = useMutation( {
		mutationFn: async ( { editedRow, updateAll } ) => {
			setNotification( 'newRow', { message: 'Adding row…', status: 'info' } );
			const response = await postFetch( `${ slug }/create`, editedRow, { skipErrorHandling: true } );
			return { response, updateAll };
		},
		onSuccess: ( { response, updateAll } ) => {
			const rsp = response;
			if ( rsp.ok ) {
				if ( updateAll ) {
					queryClient.invalidateQueries( [ slug ] );
				}
				if ( ! updateAll ) {
					queryClient.invalidateQueries( [ slug, filters, sorting ] );
				}
				setNotification( 'newRow', { message: __( 'Row has been added' ), status: 'success' } );
				return false;
			}

			if ( rsp.status === 400 ) {
				handleApiError( 'newRow', rsp, { title: __( 'Adding row failed' ) } );
			} else {
				handleApiError( 'newRow', rsp, { message: __( 'Adding row failed' ) } );
			}
		},
	} );

	const insertRow = useCallback( ( { editedRow, updateAll } ) => {
		insertNewRow.mutate( { editedRow, updateAll } );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ insertNewRow.mutate ] ); // .mutate dependency, refer to https://github.com/TanStack/query/issues/1858#issuecomment-788641472

	const updateRowData = useMutation( {
		mutationFn: async ( opts ) => {
			const { editedRow, newVal, cell, customEndpoint, changeField, id, updateMultipleData } = opts;
			// Updating one cell value only
			if ( newVal !== undefined && cell && newVal !== cell.getValue() ) {
				setNotification( cell.row.original[ paginationId ], { message: `Updating row${ id ? ' “' + cell.row.original[ id ] + '”' : '' }…`, status: 'info' } );
				const cellId = changeField ? changeField : cell.column.id;
				//make sure to not mutate source 'data' state object or it's inner 'row' objects!
				const newPagesArray = ( data?.pages || [] ).map( ( page ) =>
					page.map( ( row ) => {
						const currentRowId = optionalSelector
							? `${ row[ paginationId ] }/${ row[ optionalSelector ] }`
							: row[ paginationId ];
						const newRow = { ...row };
						if ( currentRowId === getRowId( cell ) ) {
							newRow[ cellId ] = newVal;
						}
						return newRow;
					} ),
				);

				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ], ( origData ) => ( {
					pages: newPagesArray,
					pageParams: origData.pageParams,
				} ) );

				// Called from another field, ie in Generator status
				if ( changeField ) {
					const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, { [ changeField ]: newVal }, { skipErrorHandling: true } );
					return { response, cell, id: cell.row.original[ id ] };
				}

				// if updateMultipleData, consider newVal object contains multiple data to save
				if ( updateMultipleData ) {
					const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, newVal, { skipErrorHandling: true } );
					return { response, cell, id: cell.row.original[ id ] };
				}

				const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, { [ cellId ]: newVal }, { skipErrorHandling: true } );
				return { response, cell, id: cell.row.original[ id ] };
			}

			// Updating whole row via edit panel
			if ( data?.pages && editedRow ) {
				setNotification( id ? editedRow[ id ] : editedRow[ paginationId ], { message: `Updating row${ id ? ' “' + editedRow[ id ] + '”' : '' }…`, status: 'info' } );

				//make sure to not mutate source 'data' state object or it's inner 'row' objects!
				const newPagesArray = data.pages.map( ( page ) =>
					page.map( ( row ) => {
						const newRow = { ...row };
						if ( newRow[ paginationId ] === editedRow[ paginationId ] ) {
							return editedRow;
						}
						return newRow;
					} ),
				) ?? [];

				if ( queryClient.getQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ] ) ) {
					queryClient.setQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ], ( origData ) => ( {
						pages: newPagesArray,
						pageParams: origData.pageParams,
					} ) );
				}

				if ( optionalSelector ) {
					const response = await postFetch( `${ slug }/${ editedRow[ paginationId ] }/${ editedRow[ optionalSelector ] }`, editedRow, { skipErrorHandling: true } );
					return { response, cell, editedRow, id: editedRow[ id ] };
				}
				const response = await postFetch( `${ slug }/${ editedRow[ paginationId ] }`, editedRow, { skipErrorHandling: true } );

				return { response, cell, editedRow, id: editedRow[ id ] };
			}

			if ( editedRow ) {
				setNotification( editedRow[ paginationId ], { message: `Updating row${ id ? ' “' + editedRow[ id ] + '”' : '' }…`, status: 'info' } );
				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ], ( origData ) => {
					return origData;
				} );
			}

			if ( optionalSelector ) {
				const response = await postFetch( `${ slug }/${ editedRow[ paginationId ] }/${ editedRow[ optionalSelector ] }`, editedRow, { skipErrorHandling: true } );
				return { response, cell, editedRow, id: editedRow[ id ] };
			}
			const response = await postFetch( `${ slug }/${ editedRow[ paginationId ] }`, editedRow, { skipErrorHandling: true } );
			return { response, cell, editedRow, id: editedRow[ id ] };
		},
		onSuccess: ( { response, editedRow, cell, id } ) => {
			const { ok } = response;
			if ( ok ) {
				setNotification( cell ? cell.row.original[ paginationId ] : editedRow[ paginationId ], { message: `Row${ id ? ' “' + id + '”' : '' } has been updated`, status: 'success' } );
				queryClient.invalidateQueries( [ slug ] );
				if ( editedTableSlug ) {
					queryClient.invalidateQueries( [ originSlug ] );
				}
				if ( relatedQueries.length ) {
					relatedQueries.forEach( ( query ) => {
						queryClient.invalidateQueries( [ query ] );
					} );
				}
			} else {
				handleApiError( cell ? cell.row.original[ paginationId ] : editedRow[ paginationId ], response, { title: __( 'Row update failed' ) } );
			}
			useTablePanels.setState( { otherTableSlug: undefined } );
			useTablePanels.setState( { otherTableRowId: undefined } );
		},
	} );

	const updateRow = useCallback( async ( { newVal, cell, otherTableSlug, customEndpoint, changeField, fieldVal, id, updateAll, updateMultipleData } ) => {
		if ( newVal === undefined && ! otherTableSlug ) { // Editing whole row = parameters are preset
			setRowToEdit( cell.row.original );
			return false;
		}
		if ( newVal === undefined && otherTableSlug ) { // Editing row from other table
			useTablePanels.setState( { otherTableSlug } );
			useTablePanels.setState( { otherTableRowId: id } );
			const fetchObject = {
				sorting: [ { col: id, dir: 'ASC' } ],
				filters: [ { col: id, op: '=', val: fieldVal } ],
				rows_per_page: 1,
			};
			const response = await postFetch( otherTableSlug, fetchObject );
			if ( response.ok ) {
				const returnedRow = await response.json();
				setRowToEdit( returnedRow[ 0 ] );
				activatePanel( 'rowEditor' );
			}
			return false;
		}

		// do not run mutate if the value of cell is the same as previous
		if ( newVal === cell.getValue() ) {
			return false;
		}
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, id, updateAll, updateMultipleData } );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ activatePanel, setRowToEdit, updateRowData.mutate ] ); // .mutate dependency, refer to https://github.com/TanStack/query/issues/1858#issuecomment-788641472

	const saveEditedRow = useCallback( ( { editedRow, id, updateAll } ) => {
		updateRowData.mutate( { editedRow, id, updateAll } );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ updateRowData.mutate ] ); // .mutate dependency, refer to https://github.com/TanStack/query/issues/1858#issuecomment-788641472

	// Remove rows from loaded table for optimistic update used in setQueryData
	const processDeletedPages = useCallback( ( rowData ) => {
		// get current data directly from store to remove function dependency 'data'
		// otherwise it cause recreation of deleteRow which use this as dependency and it leads to table columns recreation where deleteRow is currently used as dependency
		const currentData = useTableStore.getState().tables[ slug ]?.data;
		const deletedPagesArray = currentData?.pages;
		let newDeletedPagesArray;

		if ( rowData && ! Array.isArray( rowData ) ) {
			newDeletedPagesArray = deletedPagesArray?.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( rowData ) ) ) ?? [];

			return newDeletedPagesArray;
		}

		rowData?.forEach( ( singleRow ) => {
			newDeletedPagesArray = deletedPagesArray?.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( singleRow ) ) ) ?? [];
		} );

		return newDeletedPagesArray;
	}, [ slug, getRowId, paginationId ] );

	//Main mutate function handling deleting, optimistic updates and error/success notifications
	const deleteSelectedRow = useMutation( {
		mutationFn: async ( opts ) => {
			const { deletedPagesArray, rowData, id, updateAll } = opts;
			let idArray = [];

			// // Optimistic update of table to immediately delete rows before delete request passed in database
			if ( deletedPagesArray?.flat().length && queryClient.getQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ] ) ) {
				queryClient.setQueryData( [ slug, filtersArray( filters ), sorting, fetchOptions ], ( origData ) => {
					return {
						pages: deletedPagesArray,
						pageParams: origData.pageParams,
					};
				} );
			}

			// Single row delete
			if ( ! Array.isArray( rowData ) ) {
				const row = rowData.row || rowData;

				// Shows notification for single row to delete
				setNotification( row.original[ paginationId ], {
					message: `Deleting row${ id ? ' “' + row.original[ id ] + '”' : '' }…`, status: 'info',
				} );

				// sending only one object in array for single row
				const response = await del( slug, [ { [ paginationId ]: row.original[ paginationId ], [ optionalSelector ]: row.original[ optionalSelector ] } ] ); // Sends array of ONE  row  as object with ID and optional ID to slug/delete endpoint
				return { response, id: row.original[ id ], updateAll };
			}

			// Multiple rows delete
			rowData?.forEach( ( singleRow ) => {
				const row = singleRow.original || singleRow;
				if ( optionalSelector ) {
					idArray = [ ...idArray, { [ paginationId ]: row[ paginationId ], [ optionalSelector ]: row[ optionalSelector ] } ];
					return false;
				}
				idArray = [ ...idArray, { [ paginationId ]: row[ paginationId ] } ];
			} );

			setNotification( 'multiple', {
				message: `Deleting multiple rows…`, status: 'info',
			} );

			deselectAllRows( slug );
			const response = await del( slug, idArray ); // Sends array of object of row IDs and optional IDs to slug/delete endpoint
			return { response, id, updateAll };
		},
		onSuccess: ( { response, id, updateAll } ) => {
			const { ok } = response;
			if ( ok ) {
				//If id present, single row sentence (Row Id has been deleted) else show Rows have been deleted
				setNotification( id ? id : 'multiple', { message: `${ id ? 'Row “' + id + '” has' : 'Rows have' } been deleted`, status: 'success' } );
				rowIndex += 1;
			}

			if ( rowIndex === 1 ) {
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
				setNotification( id ? id : 'multiple', { message: `Deleting ${ id ? 'row “' + id + '”' : 'of some rows' } failed`, status: 'error' } );
			}
		},
	} );

	// Single row delete call used from table
	const deleteRow = useCallback( ( { cell, id, updateAll } ) => {
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), rowData: cell, optionalSelector, id, updateAll } );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ optionalSelector, deleteSelectedRow.mutate, processDeletedPages ] );// .mutate dependency, refer to https://github.com/TanStack/query/issues/1858#issuecomment-788641472

	// Multiple rows delete used from table
	const deleteMultipleRows = useCallback( ( options ) => {
		const { rowsToDelete, updateAll } = options || {};

		if ( ! rowsToDelete ) {
			const selectedRowsInTable = Object.values( useSelectRows.getState().selectedRows[ slug ] ) || [];

			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( selectedRowsInTable ), rowData: selectedRowsInTable, optionalSelector, updateAll } );
			return false;
		}

		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( rowsToDelete ), rowData: rowsToDelete, optionalSelector, updateAll } );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ deleteSelectedRow.mutate, optionalSelector, processDeletedPages, slug ] );// .mutate dependency, refer to https://github.com/TanStack/query/issues/1858#issuecomment-788641472

	const isSelected = useCallback( ( tableElem, allRows = false ) => {
		// header row select all checkbox
		if ( allRows ) {
			const selectedAll = useSelectRows.getState().selectedAll[ slug ];
			return selectedAll ? true : false;
		}
		// standard row checkbox
		const rowId = tableElem?.row?.id;
		const selected = useSelectRows.getState().selectedRows[ slug ]?.[ rowId ] !== undefined;
		return selected;
	}, [ slug ] );

	// Function for row selection/deselection from table
	const selectRows = useCallback( ( tableElem, checked = true, allRows = false ) => {
		// handle header row select all checkbox change
		if ( allRows ) {
			const { rows } = tableElem.table?.getRowModel();
			setSelectedAll( slug, checked );
			setSelectedRows( checked
				? { ...useSelectRows.getState().selectedRows, [ slug ]: { ...rows } }
				: {}
			);
			return false;
		}

		// handle change of standard row checkbox
		const rowId = tableElem?.row?.id;
		const slugSelectedRows = useSelectRows.getState().selectedRows[ slug ] || {};
		if ( checked ) {
			setSelectedRows( { ...useSelectRows.getState().selectedRows, [ slug ]: { ...slugSelectedRows, [ rowId ]: tableElem.row } } );
			return false;
		}
		// uncheck select all checkbox if row checkbox was unchecked
		setSelectedAll( slug, false );
		const reducedSlugSelectedRows = { ...slugSelectedRows };
		delete reducedSlugSelectedRows[ rowId ];
		setSelectedRows( {
			...useSelectRows.getState().selectedRows,
			[ slug ]: reducedSlugSelectedRows,
		} );
	}, [ setSelectedAll, setSelectedRows, slug ] );

	return { insertRow, isSelected, selectRows, deleteRow, deleteMultipleRows, updateRow, saveEditedRow, getRowId };
}
