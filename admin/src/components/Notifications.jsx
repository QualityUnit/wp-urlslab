import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactComponent as Bell } from '../assets/images/notifications-icon.svg';

import '../assets/styles/components/_Notifications.scss';

export default function Notifications( { className } ) {
	const queryClient = useQueryClient();
	const { data: notifications, status } = useQuery( {
		queryKey: [ 'notifications' ],
		queryFn: queryClient.getQueryData( [ 'notifications' ] ),
	} );

	return (
		<div className="urlslab-notifications">
			<Bell className="urlslab-notifications-icon" />
			{ notifications && Object.keys( notifications )?.length
				? <span className="urlslab-notifications-counter">
					{ Object.keys( notifications )?.length }
				</span>
				: null
			}
		</div>
	);
}
