import '../assets/styles/components/_NotificationsPanel.scss';

export default function NotificationsPanel( props ) {
	const { message, status } = props;
	return (
		<div className={ `urlslab-notifications-panel ${ status || '' } fadeInto` }>
			<strong>{ message }</strong>
		</div>
	);
}
