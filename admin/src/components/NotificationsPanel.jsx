import '../assets/styles/components/_NotificationsPanel.scss';

export default function NotificationsPanel( props ) {
	const { message, title, status } = props;
	return (
		<div className={ `urlslab-notifications-panel ${ status || '' } fadeInto` }>
			{ ! title
				? <strong>{ message }</strong>
				: <div className="combined-message">
					<strong>{ title }</strong>
					<br />
					{ message }
				</div>
			}
		</div>
	);
}
