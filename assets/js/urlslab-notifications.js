
window.urlsLab = {};
urlsLab.setNotification = ( props ) => {

	const { message, status } = props;
	const id = Date.now();
	const body = document.body;
	
	if (document.querySelector('.urlslab-notifications') === null) {
		const notificationsWrapper = document.createElement('div');
		notificationsWrapper.classList.add('urlslab-notifications');
		body.appendChild(notificationsWrapper);
	}
	
	const notificationsWrapper = document.querySelector('.urlslab-notifications');

	const panel = `<div data-panelId='${id}' class='urlslab-notifications-panel ${status || ''} fadeInto'>
		<strong>${message}</strong>
	</div>`

	notificationsWrapper.insertAdjacentHTML('beforeend', panel);

	setTimeout(() => {
		document.querySelector(`[data-panelid='${id}']`).remove();
		if (! document.querySelectorAll('.urlslab-notifications-panel').length) {
			notificationsWrapper.remove();
		}
	}, 3000);
}
