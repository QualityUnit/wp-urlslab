import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactComponent as Bell } from '../assets/images/notifications-icon.svg';

import ProgressBar from '../elements/ProgressBar';
import '../assets/styles/components/_Notifications.scss';

export default function Notifications( { className } ) {
	const ref = useRef( null );
	const [ panelActive, setPanelActive ] = useState( false );
	const queryClient = useQueryClient();
	const { data: notifications } = useQuery( {
		queryKey: [ 'notifications' ],
		queryFn: queryClient.getQueryData( [ 'notifications' ] ),
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
						? <div className={ `urlslab-notifications-panel urlslab-panel ${ panelActive && 'active' } fadeInto` }>
							<ProgressBar value={ notifications?.export } />
						</div>
						: null
				}
			</button>
		</div>
	);
}
