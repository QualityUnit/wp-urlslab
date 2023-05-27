import { useCallback, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { postFetch } from '../api/fetching';
import filtersArray from '../lib/filtersArray';
import { setNotification } from '../hooks/useNotifications';

export default function useChangeRow( { data, url, slug, paginationId } ) {
	const queryClient = useQueryClient();
	const [ rowToEdit, setEditorRow ] = useState( {} );
	const [ insertRowResult, setEditorRowRes ] = useState( false );
	const [ activePanel, setActivePanel ] = useState();
	const [ selectedRows, setSelectedRows ] = useState( [] );
	const [ responseCounter, setResponseCounter ] = useState( 0 );

	const { filters, sorting } = url;

	const getRowId = useCallback( ( cell, optionalSelector ) => {
		if ( optionalSelector ) {
			return `${ cell.row.original[ paginationId ] }/${ cell.row.original[ optionalSelector ] }`;
		}
		return cell.row.original[ paginationId ];
	}, [ paginationId ] );

	const insertNewRow = useMutation( {
		mutationFn: async ( { editedRow } ) => {
			setNotification( slug, { message: 'Adding row…', status: 'info' } );
			const response = await postFetch( `${ slug }/create`, editedRow );
			setNotification( slug, { message: 'Adding row…', status: 'info' } );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = await response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				setNotification( slug, { message: 'Row has been added', status: 'success' } );
				setEditorRowRes( response );
			}

			if ( ! ok ) {
				setNotification( slug, { message: 'Adding row failed', status: 'error' } );
			}
		},
	} );
	const insertRow = ( { editedRow } ) => {
		insertNewRow.mutate( { editedRow } );
	};

	const updateRowData = useMutation( {
		mutationFn: async ( options ) => {
			const { editedRow, newVal, cell, customEndpoint, changeField, optionalSelector, id } = options;

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
					return { response };
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
		onSuccess: ( { response, editedRow, id } ) => {
			const { ok } = response;
			if ( ok ) {
				if ( editedRow ) {
					setEditorRowRes( response );
					setActivePanel();
				}
				setNotification( slug, { message: `Row${ id ? ' “' + id + '”' : '' } has been updated`, status: 'success' } );
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
			}
			if ( ! ok ) {
				setNotification( slug, { message: `Updating row${ id ? ' “' + id + '”' : '' } failed`, status: 'error' } );
			}
		},
	} );

	const updateRow = ( { newVal, cell, customEndpoint, changeField, optionalSelector, id } ) => {
		if ( ! newVal ) { // Editing whole row = parameters are preset
			setEditorRow( cell.row.original );
			return false;
		}
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, optionalSelector, id } );
	};

	const saveEditedRow = ( { editedRow, id } ) => {
		updateRowData.mutate( { editedRow, id } );
	};

	const processDeletedPages = useCallback( ( cell ) => {
		let deletedPagesArray = data?.pages;
		if ( cell.row.getIsSelected() ) {
			cell.row.toggleSelected();
		}
		setSelectedRows( [] );
		return deletedPagesArray = deletedPagesArray.map( ( page ) => page.filter( ( row ) => row[ paginationId ] !== getRowId( cell ) ) ) ?? [];
	}, [ data?.pages, getRowId, paginationId ] );

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { deletedPagesArray, cell, optionalSelector, id } = options;
			setNotification( slug, {
				message: `Deleting row${ id ? ' “' + cell.row.original[ id ] + '”' : '' }…`, status: 'info' } );

			queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
				pages: deletedPagesArray,
				pageParams: origData.pageParams,
			} ) );

			const response = await del( `${ slug }/${ getRowId( cell, optionalSelector ) }` );
			return { response, id: cell.row.original[ id ] };
		},
		onSuccess: async ( { response, id } ) => {
			const { ok } = response;
			if ( ok ) {
				setNotification( slug, { message: `Row${ id ? ' “' + id + '”' : '' } has been deleted`, status: 'success' } );
				setResponseCounter( responseCounter - 1 );
			}

			if ( responseCounter === 0 || responseCounter === 1 ) {
				await queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				await queryClient.invalidateQueries( [ slug, 'count' ] );
			}

			if ( ! ok ) {
				setNotification( slug, { message: `Deleting row${ id ? ' “' + id + '”' : '' } failed`, status: 'error' } );
			}
		},
	} );

	const deleteRow = useCallback( ( { cell, optionalSelector, id } ) => {
		setResponseCounter( 1 );
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), cell, optionalSelector, id } );
	}, [ processDeletedPages, deleteSelectedRow ] );

	const deleteSelectedRows = async ( { optionalSelector, id } ) => {
		// Multiple rows delete
		setResponseCounter( selectedRows.length );

		selectedRows.map( ( cell ) => {
			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), cell, optionalSelector, id } );
			return false;
		} );
	};

	const selectRow = ( isSelected, cell ) => {
		cell.row.toggleSelected();
		if ( ! isSelected ) {
			setSelectedRows( selectedRows.filter( ( item ) => item !== cell ) );
		}
		if ( isSelected ) {
			setSelectedRows( selectedRows.concat( cell ) );
		}
	};

	return { row: rowValue, selectedRows, insertRowResult, insertRow, rowToEdit, setEditorRow, activePanel, setActivePanel, selectRow, deleteRow, deleteSelectedRows, updateRow, saveEditedRow };
}
