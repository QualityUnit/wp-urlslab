import { useQueryClient } from '@tanstack/react-query';

let notificationsTimer = 0;
export default function useNotifications() {
	const queryClient = useQueryClient();

	const setNotification = ( slug, dataObj ) => {
		queryClient.setQueryData( [ 'notifications' ], ( data ) => {
			return { ...data, [ slug ]: dataObj };
		} );

		queryClient.invalidateQueries( [ 'notifications' ], { refetchType: 'all' } );
		clearTimeout( notificationsTimer );

		notificationsTimer = setTimeout( () => {
			queryClient.setQueryData( [ 'notifications' ], ( data ) => {
				const dataCopy = { ...data };
				delete dataCopy[ slug ];
				return dataCopy;
			} );
			queryClient.invalidateQueries( [ 'notifications' ] );
		}, 3000 ); //remove notification after 5 seconds
	};

	return { setNotification };
}
