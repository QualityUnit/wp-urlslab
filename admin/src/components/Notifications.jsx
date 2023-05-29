import useNotifications from '../hooks/useNotifications';

import '../assets/styles/components/_Notifications.scss';
import NotificationsPanel from './NotificationsPanel';

export default function Notifications() {
	const notifications = useNotifications( ( state ) => state.notifications );

	let notificationsCount;
	if ( notifications ) {
		notificationsCount = Object.keys( notifications )?.length > 0;
	}

	return (
		notificationsCount &&
		<div className="urlslab-notifications">
			{
				Object.entries( notifications ).map( ( [ module, data ] ) => {
					return <NotificationsPanel key={ module } { ...data } />;
				}
				)
			}
		</div>
	);
}
