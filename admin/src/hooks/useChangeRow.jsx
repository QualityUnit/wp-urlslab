import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { setData } from '../api/fetching';

export default function useChangeRow( { data, url, slug, pageId } ) {
	const [ rowValue, setRow ] = useState();
	const queryClient = useQueryClient();

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
		mutationFn: async ( options ) => {
			const { rowToInsert, pseudoRow } = options;
			const newPagesArray = data?.pages.map( ( page ) => [ pseudoRow, ...page ] );

			//For optimistic update -- will be moved to onSuccess and will get row response from API
			// queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
			// 	pages: newPagesArray,
			// 	pageParams: origData.pageParams,
			// } ) );
			const response = await setData( `${ slug }/import`, { rows: [ rowToInsert ] } );
			return response;
		},
		onSuccess: ( response ) => {
			const { ok } = response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, url ] );
			}
		},
	} );
	const insertRow = ( { rowToInsert, pseudoRow } ) => {
		insertNewRow.mutate( { data, url, slug, rowToInsert, pseudoRow } );
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

	const selectRow = ( val, cell ) => {
		cell.row.toggleSelected();
		console.log( { selected: cell.row.original[ pageId ] } );
	};

	return { row: rowValue, insertRow, selectRow, deleteRow, updateRow };
}
