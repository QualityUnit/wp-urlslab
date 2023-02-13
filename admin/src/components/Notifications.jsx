import { ReactComponent as Bell } from '../assets/images/notifications-icon.svg';

import '../assets/styles/components/_Notifications.scss';

export default function Notifications( { className, children } ) {
	return (
		<div className="urlslab-notifications">
			<Bell className="urlslab-notifications-icon" />
			<span className="urlslab-notifications-counter">
				2
			</span>
		</div>
	);
}
