import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow } from '../api/deleteTableData';

export function useChangeRow( options ) {
	const { slug, cell, rowSelector, operation } = options;
	const queryClient = useQueryClient();

	const getRowId = () => {
		return cell.row.original[ rowSelector ];
	};

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( ) => {
			return deleteRow( `${ slug }/${ getRowId() }` );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	if ( operation === 'delete' ) {
		console.log( `${ slug } / ${ getRowId() }` );
	}
}
