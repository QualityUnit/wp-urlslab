import { useQuery, useQueryClient } from '@tanstack/react-query';

import '../assets/styles/components/_Notifications.scss';
import NotificationsPanel from './NotificationsPanel';

export default function Notifications() {
	const queryClient = useQueryClient();
	const { data: notifications } = useQuery( {
		queryKey: [ 'notifications' ],
		queryFn: () => queryClient.getQueryData( [ 'notifications' ] ),
		initialData: {},
		refetchOnWindowFocus: false,
	} );

	let notificationsCount = null;
	if ( notifications ) {
		notificationsCount = Object.keys( notifications )?.length > 0;
	}

	return (
		<div key={ notifications } className="urlslab-notifications">
			{
				notificationsCount &&
					Object.entries( notifications ).map( ( [ module, data ] ) => {
						return <NotificationsPanel key={ module } { ...data } />;
					}
					)
			}
		</div>
	);
}
