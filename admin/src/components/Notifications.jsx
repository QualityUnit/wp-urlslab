import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactComponent as Bell } from '../assets/images/notifications-icon.svg';

import ProgressBar from '../elements/ProgressBar';
import '../assets/styles/components/_Notifications.scss';
import NotificationsPanel from './NotificationsPanel';

export default function Notifications( { className } ) {
	const ref = useRef( null );
	const [ panelActive, setPanelActive ] = useState( false );
	const queryClient = useQueryClient();
	const { data: notifications } = useQuery( {
		queryKey: [ 'notifications' ],
		queryFn: queryClient.getQueryData( [ 'notifications' ] ),
		refetchOnWindowFocus: false,
	} );

	let notificationsCount = null;
	if ( notifications ) {
		notificationsCount = Object.keys( notifications )?.length;
	}

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! ref.current?.contains( event.target ) && panelActive ) {
				setPanelActive( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	} );

	return (
		<div ref={ ref } className="urlslab-notifications">
			<button className="urlslab-notifications-activator" onClick={ () => setPanelActive( ! panelActive ) }>

				<Bell className="urlslab-notifications-icon" />
				{ notifications && notificationsCount
					? <span className="urlslab-notifications-counter">
						{ notificationsCount }
					</span>
					: null
				}
				{
					notificationsCount
						? <NotificationsPanel active />
						: null
				}
			</button>
		</div>
	);
}
