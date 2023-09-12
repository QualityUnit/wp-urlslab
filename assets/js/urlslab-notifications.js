const setNotification = ( props ) => {
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

const getFetch = async (slug) => {
	try {
		const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}` : ''}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		});
		return result;
	} catch (error) {
		return false;
	}
}

document.querySelector('#wp-admin-bar-urlslab-cache-clearall a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing all caches', status: 'info' });
	const response = await getFetch();
	// const message = await response.json();

	if (response.ok) {
		setNotification({ message: 'Cleared all caches', status: 'success' });
		return false;
	}

})
