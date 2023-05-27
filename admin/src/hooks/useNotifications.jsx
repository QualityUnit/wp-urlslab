import { create } from 'zustand';

const useNotifications = create( ( ) => ( {
	notifications: {},
} ) );

export default useNotifications;

export function setNotification( id, dataObj ) {
	const notificationsTimer = {};
	notificationsTimer[ id ] = 0;

	useNotifications.setState( ( state ) => ( {
		notifications: { ...state.notifications, [ id ]: dataObj },
	} )	);

	clearTimeout( notificationsTimer[ id ] );

	notificationsTimer[ id ] = setTimeout( () => {
		useNotifications.setState( ( state ) => {
			const dataCopy = { ...state.notifications };
			delete dataCopy[ id ];
			return {
				notifications: dataCopy,
			};
		} );
	}, 3000 ); //remove notification after 5 seconds
}
