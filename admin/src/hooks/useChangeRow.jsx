import { useCallback, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { postFetch } from '../api/fetching';
import filtersArray from '../lib/filtersArray';
import useTablePanels from './useTablePanels';

export default function useChangeRow( { data, url, slug, paginationId } ) {
	const queryClient = useQueryClient();
	const setRowToEdit = useTablePanels( ( state ) => state.setRowToEdit );
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
			const response = await postFetch( `${ slug }/create`, editedRow );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = await response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
			}
		},
	} );
	const insertRow = ( { editedRow } ) => {
		insertNewRow.mutate( { editedRow } );
	};

	const updateRowData = useMutation( {
		mutationFn: async ( opts ) => {
			const { editedRow, newVal, cell, customEndpoint, changeField, optionalSelector } = opts;

			// Updating one cell value only
			if ( newVal ) {
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
				return { response };
			}

			// // // Updating whole row via edit panel
			const paginateArray = data?.pages;
			let newPagesArray = [];
			if ( paginateArray && editedRow ) {
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
				return { response, editedRow };
			}
		},
		onSuccess: ( { response } ) => {
			const { ok } = response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
			}
		},
	} );

	const updateRow = ( { newVal, cell, customEndpoint, changeField, optionalSelector } ) => {
		if ( ! newVal ) { // Editing whole row = parameters are preset
			setRowToEdit( cell.row.original );
			return false;
		}
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, optionalSelector } );
	};

	const saveEditedRow = ( { editedRow } ) => {
		updateRowData.mutate( { editedRow } );
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
		mutationFn: async ( opts ) => {
			const { deletedPagesArray, cell, optionalSelector } = opts;

			queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
				pages: deletedPagesArray,
				pageParams: origData.pageParams,
			} ) );

			const response = await del( `${ slug }/${ getRowId( cell, optionalSelector ) }` );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;
			if ( ok ) {
				setResponseCounter( responseCounter - 1 );
			}

			if ( responseCounter === 0 || responseCounter === 1 ) {
				await queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				await queryClient.invalidateQueries( [ slug, 'count' ] );
			}
		},
	} );

	const deleteRow = useCallback( ( { cell, optionalSelector } ) => {
		setResponseCounter( 1 );
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), cell, optionalSelector } );
	}, [ processDeletedPages, deleteSelectedRow ] );

	const deleteSelectedRows = async ( optionalSelector ) => {
		// Multiple rows delete
		setResponseCounter( selectedRows.length );

		selectedRows.map( ( cell ) => {
			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), cell, optionalSelector } );
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

	return { selectedRows, insertRow, selectRow, deleteRow, deleteSelectedRows, updateRow, saveEditedRow };
}
