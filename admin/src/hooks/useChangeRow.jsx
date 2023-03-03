import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';

export function useChangeRow() {
	const queryClient = useQueryClient();

	const getRowId = ( cell, rowSelector ) => {
		return cell.row.original[ rowSelector ];
	};

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { slug, cell, rowSelector } = options;
			del( `${ slug }/${ getRowId( cell, rowSelector ) }` );
			return slug;
		},
		onSuccess: ( slug ) => {
			console.log( slug );
			// console.log( queryClient.getQueryData( [ slug ] ) );
			queryClient.invalidateQueries( [ slug ] );
		},
	} );
	const deleteRow = ( slug, cell, rowSelector ) => {
		deleteSelectedRow.mutate( { slug, cell, rowSelector } );
	};

	return { deleteRow };
}
