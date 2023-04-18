import { useCallback, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';
import { setData } from '../api/fetching';

export default function useChangeRow( { data, filters, slug, primaryColumns } ) {
	const queryClient = useQueryClient();
	const [ rowValue, setRow ] = useState();
	const [ insertRowResult, setInsertRowRes ] = useState( false );
	const [ selectedRows, setSelectedRows ] = useState( [] );
	const [ responseCounter, setResponseCounter ] = useState( 0 );

	const getRowId = useCallback( ( cell, optionalSelector ) => {
		let path = '';
		primaryColumns.forEach( ( column ) => {
			path += `${ cell.row.original[ column ] }/`;
		});
		if ( optionalSelector ) {
			return `${ path }${ cell.row.original[ optionalSelector ] }`;
		}
		return path;
	}, [ primaryColumns ] );

	const getRow = ( cell ) => {
		return cell.row.original;
	};

	const insertNewRow = useMutation( {
		mutationFn: async ( { rowToInsert } ) => {
			const response = await setData( `${ slug }/create`, rowToInsert );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = await response;
			if ( ok ) {
				queryClient.invalidateQueries( [ slug ] );
				setInsertRowRes( response );
			}
		},
	} );
	const insertRow = ( { rowToInsert } ) => {
		insertNewRow.mutate( { rowToInsert } );
	};

	const processDeletedPages = useCallback( ( cell ) => {
		let deletedPagesArray = data?.pages;
		if ( cell.row.getIsSelected() ) {
			cell.row.toggleSelected();
		}
		setSelectedRows( [] );
		return deletedPagesArray = deletedPagesArray.map( ( page ) => page.filter( ( row ) => row[ primaryColumns[0] ] !== getRowId( cell ) ) ) ?? []; //TODO: fix this, there could be more primary columns if we want to delete a row!
	}, [ data?.pages, getRowId, primaryColumns ] );

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { deletedPagesArray, cell, optionalSelector } = options;

			queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
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
				await queryClient.invalidateQueries( [ slug, filters ] ); /// TODO : ma tu byt filters???? to som len ja pridal
				await queryClient.invalidateQueries( [ slug, 'count' ] );//TODO .... filters do countu????
			}
		},
	} );

	const deleteRow = useCallback( ( { cell, optionalSelector } ) => {
		setResponseCounter( 1 );
		deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), url, slug, cell, optionalSelector } );
	}, [ processDeletedPages, deleteSelectedRow, slug, url ] );

	const deleteSelectedRows = async ( optionalSelector ) => {
		// Multiple rows delete
		setResponseCounter( selectedRows.length );

		selectedRows.map( ( cell ) => {
			deleteSelectedRow.mutate( { deletedPagesArray: processDeletedPages( cell ), url, slug, cell, optionalSelector } );
			return false;
		} );
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
		if ( ! isSelected ) {
			setSelectedRows( selectedRows.filter( ( item ) => item !== cell ) );
		}
		if ( isSelected ) {
			setSelectedRows( selectedRows.concat( cell ) );
		}
	};

	return { row: rowValue, selectedRows, insertRowResult, insertRow, selectRow, deleteRow, deleteSelectedRows, updateRow };
}
