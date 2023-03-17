import '../assets/styles/components/_NotificationsPanel.scss';

export default function NotificationsPanel( { children, className, active } ) {
	return (
		active
			? <div className={ `urlslab-notifications-panel urlslab-panel ${ className || '' } ${ active && 'active' } fadeInto` }>
				{ children }
			</div>
			: null
	);
}
