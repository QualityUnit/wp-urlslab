import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { setData } from '../api/fetching';

export default function useChangeRow( { data, url, slug, pageId } ) {
	const [ rowValue, setRow ] = useState();
	const queryClient = useQueryClient();
	const [ insertRowResult, setInsertRowRes ] = useState( false );
	const [ rowsSelected, setRowsSelected ] = useState( false );
	const selectedRows = [];

	const getRowId = ( cell, optionalSelector ) => {
		if ( optionalSelector ) {
			return `${ cell.row.original[ pageId ] }/${ cell.row.original[ optionalSelector ] }`;
		}
		return cell.row.original[ pageId ];
	};

	const getRow = ( cell ) => {
		return cell.row.original;
	};

	const insertNewRow = useMutation( {
		mutationFn: async ( { rowToInsert } ) => {
			const response = await setData( `${ slug }`, rowToInsert );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = await response;
			const returnedRow = await response.json();
			if ( ok ) {
				// const newPagesArray = data?.pages.map( ( page ) => [ returnedRow, ...page ] );
				// queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
				// 	pages: newPagesArray,
				// 	pageParams: origData.pageParams,
				// } ) );
				queryClient.invalidateQueries( [ slug ] );
				setInsertRowRes( response );
			}
		},
	} );
	const insertRow = ( { rowToInsert } ) => {
		insertNewRow.mutate( { rowToInsert } );
	};

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { cell, optionalSelector } = options;
			const newPagesArray = data?.pages.map( ( page ) =>

				page.filter( ( row ) =>
					row[ pageId ] !== getRowId( cell )
				),
			) ?? [];

			queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
				pages: newPagesArray,
				pageParams: origData.pageParams,
			} ) );
			setRow( getRow( cell ) );
			setTimeout( () => setRow(), 3000 );
			const response = await del( `${ slug }/${ getRowId( cell, optionalSelector ) }` );
			return response;
		},
		onSuccess: async ( response ) => {
			const { ok } = response;
			if ( ok ) {
				await queryClient.invalidateQueries( [ slug, url ] );
			}
		},
		onSettled: async ( { options } ) => {
			await queryClient.invalidateQueries( [ options.slug, 'count' ] );
		},
	} );
	const deleteRow = ( { cell, optionalSelector } ) => {
		deleteSelectedRow.mutate( { data, url, slug, cell, optionalSelector } );
	};

	const updateRowData = useMutation( {
		mutationFn: async ( options ) => {
			const { newVal, cell, optionalSelector } = options;
			const cellId = cell.column.id;

			const newPagesArray = data?.pages.map( ( page ) =>

				page.map( ( row ) => {
					if ( row[ pageId ] === getRowId( cell ) ) {
						row[ cell.column.id ] = newVal;
						return row;
					}
					return row;
				}
				),
			) ?? [];

			queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
				pages: newPagesArray,
				pageParams: origData.pageParams,
			} ) );
			// setRow( getRow( cell ) );
			// setTimeout( () => setRow(), 3000 );
			const response = await setData( `${ slug }/${ getRowId( cell, optionalSelector ) }`, { [ cellId ]: newVal } );
			return response;
		},
		onSuccess: ( response ) => {
			const { ok } = response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, url ] );
			}
		},
	} );
	const updateRow = ( { newVal, cell, optionalSelector } ) => {
		updateRowData.mutate( { data, newVal, url, slug, cell, optionalSelector } );
	};

	const selectRow = ( isSelected, cell ) => {
		cell.row.toggleSelected();
		// const cellId = cell.row.original[ pageId ];
		// if ( ! isSelected ) {
		// 	selectedRows = selectedRows.filter( ( item ) => item !== cellId );
		// }
		// if ( isSelected ) {
		// 	selectedRows.push( cell.row.original[ pageId ] );
		// }

		// console.log( selectedRows );
		// if ( selectedRows.length ) {
		// 	setRowsSelected( true );
		// }
		// if ( ! selectedRows.length ) {
		// 	setRowsSelected( false );
		// }
	};

	return { row: rowValue, rowsSelected, insertRowResult, insertRow, selectRow, deleteRow, updateRow };
}
