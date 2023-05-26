import { useQueryClient } from '@tanstack/react-query';

export default function useNotifications() {
	const notificationsTimer = {};
	const queryClient = useQueryClient();

	const setNotification = ( id, dataObj ) => {
		notificationsTimer[ id ] = 0;
		queryClient.setQueryData( [ 'notifications' ], ( data ) => {
			return { ...data, [ id ]: dataObj };
		} );

		clearTimeout( notificationsTimer[ id ] );

		notificationsTimer[ id ] = setTimeout( () => {
			queryClient.setQueryData( [ 'notifications' ], ( data ) => {
				const dataCopy = { ...data };
				delete dataCopy[ id ];
				return dataCopy;
			} );
		}, 3000 ); //remove notification after 5 seconds
	};

	return { setNotification };
}
