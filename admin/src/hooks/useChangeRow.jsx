import { useCallback, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { postFetch } from '../api/fetching';
import filtersArray from '../lib/filtersArray';

export default function useChangeRow( { data, url, slug, paginationId } ) {
	const queryClient = useQueryClient();
	const [ rowValue, setRow ] = useState();
	const [ rowToInsert, setInsertRow ] = useState( {} );
	const [ insertRowResult, setInsertRowRes ] = useState( false );
	const [ selectedRows, setSelectedRows ] = useState( [] );
	const [ responseCounter, setResponseCounter ] = useState( 0 );

	const { filters, sorting } = url;

	const getRowId = useCallback( ( cell, optionalSelector ) => {
		if ( optionalSelector ) {
			return `${ cell.row.original[ paginationId ] }/${ cell.row.original[ optionalSelector ] }`;
		}
		return cell.row.original[ paginationId ];
	}, [ paginationId ] );

	const getRow = ( cell ) => {
		return cell.row.original;
	};

	const insertNewRow = useMutation( {
		mutationFn: async ( ) => {
			const response = await postFetch( `${ slug }/create`, rowToInsert );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = await response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
				setInsertRowRes( response );
			}
		},
	} );
	const insertRow = ( ) => {
		insertNewRow.mutate( { rowToInsert } );
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
			const { deletedPagesArray, cell, optionalSelector } = options;

			queryClient.setQueryData( [ slug, filtersArray( filters ), sorting ], ( origData ) => ( {
				pages: deletedPagesArray,
				pageParams: origData.pageParams,
			} ) );

			if ( ! selectedRows.length ) {
				setRow( getRow( cell ) );
				setTimeout( () => {
					setRow();
				}, 3000 );
			}
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

	const updateRowData = useMutation( {
		mutationFn: async ( options ) => {
			const { newVal, cell, customEndpoint, changeField, optionalSelector } = options;
			const cellId = cell.column.id;

			const newPagesArray = data?.pages.map( ( page ) =>

				page.map( ( row ) => {
					if ( row[ paginationId ] === getRowId( cell ) ) {
						row[ cell.column.id ] = newVal;
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
				return response;
			}
			const response = await postFetch( `${ slug }/${ getRowId( cell, optionalSelector ) }${ customEndpoint || '' }`, { [ cellId ]: newVal } );
			return response;
		},
		onSuccess: ( response ) => {
			const { ok } = response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, filtersArray( filters ), sorting ] );
			}
		},
	} );
	const updateRow = ( { newVal, cell, customEndpoint, changeField, optionalSelector } ) => {
		updateRowData.mutate( { newVal, cell, customEndpoint, changeField, optionalSelector } );
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

	return { row: rowValue, selectedRows, insertRowResult, insertRow, rowToInsert, setInsertRow, selectRow, deleteRow, deleteSelectedRows, updateRow };
}
