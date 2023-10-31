import { create } from 'zustand';

const useNotifications = create( ( set ) => ( {
	notifications: {},
	holdDelete: false,
	setHoldDelete: ( holdDelete ) => set( () => ( { holdDelete } ) ),
} ) );

export default useNotifications;

export function setNotification( id, dataObj ) {
	const notificationsTimer = {};
	notificationsTimer[ id ] = 0;

	/*
			dataObj is an object in form {message: 'Some message', status: 'success'}:
			message: 'message to show in notification',
			status: 'info'/'success'/'error' (info – blue ribbon, success – green, error – red)
		*/

	useNotifications.setState( ( state ) => ( {
		notifications: { ...state.notifications, [ id ]: dataObj },
	} )	);

	const holdDeleteFunction = setInterval( () => {
		const holdDelete = useNotifications.getState().holdDelete;
		clearTimeout( notificationsTimer[ id ] );

		if ( ! holdDelete ) {
			clearInterval( holdDeleteFunction );
			notificationsTimer[ id ] = setTimeout( () => {
				useNotifications.setState( ( state ) => {
					const dataCopy = { ...state.notifications };
					delete dataCopy[ id ];
					return {
						notifications: dataCopy,
					};
				} );
			}, 5000 ); //remove notification after 5 seconds
		}
	}, 1000 );
}
