import useNotifications from '../hooks/useNotifications';

import '../assets/styles/components/_Notifications.scss';
import NotificationsPanel from './NotificationsPanel';

export default function Notifications() {
	const notifications = useNotifications( ( state ) => state.notifications );
	const setHoldDelete = useNotifications( ( state ) => state.setHoldDelete );

	return (
		Object.keys( notifications )?.length > 0 &&
		// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
		<div className="urlslab-notifications" onMouseOver={ () => setHoldDelete( true ) } onMouseLeave={ () => setHoldDelete( false ) } >
			{
				Object.entries( notifications ).map( ( [ id, data ] ) => {
					return <NotificationsPanel key={ id } { ...data } />;
				} )
			}
		</div>
	);
}
