import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { setData } from '../api/fetching';

export function useChangeRow() {
	const [ rowValue, setRow ] = useState();
	const queryClient = useQueryClient();

	const getRowId = ( cell, rowSelector ) => {
		return cell.row.original[ rowSelector ];
	};

	const getRow = ( cell ) => {
		return cell.row.original;
	};

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { data, url, slug, cell, rowSelector } = options;
			const newPagesArray = data?.pages.map( ( page ) =>

				page.filter( ( row ) =>
					row[ rowSelector ] !== getRowId( cell, rowSelector )
				),
			) ?? [];

			queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
				pages: newPagesArray,
				pageParams: origData.pageParams,
			} ) );
			setRow( getRow( cell ) );
			setTimeout( () => setRow(), 3000 );
			const response = await del( `${ slug }/${ getRowId( cell, rowSelector ) }` );
			return { response, options };
		},
		onSuccess: ( { response, options } ) => {
			const { ok } = response;
			const { slug, url } = options;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, url ] );
			}
		},
	} );
	const deleteRow = ( { data, url, slug, cell, rowSelector } ) => {
		deleteSelectedRow.mutate( { data, url, slug, cell, rowSelector } );
	};

	const updateRowData = useMutation( {
		mutationFn: async ( options ) => {
			const { data, newVal, url, slug, cell, rowSelector } = options;
			const cellId = cell.column.id;

			const newPagesArray = data?.pages.map( ( page ) =>

				page.map( ( row ) => {
					if ( row[ rowSelector ] === getRowId( cell, rowSelector ) ) {
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
			const response = await setData( `${ slug }/${ getRowId( cell, rowSelector ) }`, { [ cellId ]: newVal } );
			return { response, options };
		},
		onSuccess: ( { response, options } ) => {
			const { ok } = response;
			const { slug, url } = options;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug, url ] );
			}
		},
	} );
	const updateRow = ( { data, newVal, url, slug, cell, rowSelector } ) => {
		updateRowData.mutate( { data, newVal, url, slug, cell, rowSelector } );
	};

	return { row: rowValue, deleteRow, updateRow };
}
