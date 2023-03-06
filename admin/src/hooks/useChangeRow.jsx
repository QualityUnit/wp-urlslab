import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteRow as del } from '../api/deleteTableData';

export function useChangeRow() {
	const queryClient = useQueryClient();

	const getRowId = ( cell, rowSelector ) => {
		return cell.row.original[ rowSelector ];
	};

	const deleteSelectedRow = useMutation( {
		mutationFn: async ( options ) => {
			const { data, url, slug, cell, rowSelector } = options;
			const newPagesArray = data?.pages.map( ( page ) =>

				page.filter( ( val ) =>
					val[ rowSelector ] !== getRowId( cell, rowSelector )
				),
			) ?? [];

			queryClient.setQueryData( [ slug, url ], ( origData ) => ( {
				pages: newPagesArray,
				pageParams: origData.pageParams,
			} ) );
			del( `${ slug }/${ getRowId( cell, rowSelector ) }` );
			return options;
		},
		onSettled: ( { url, slug } ) => {
			queryClient.invalidateQueries( [ slug, url ] );
		},
	} );
	const deleteRow = ( { data, url, slug, cell, rowSelector } ) => {
		deleteSelectedRow.mutate( { data, url, slug, cell, rowSelector } );
	};

	return { deleteRow };
}
