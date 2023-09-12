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

const getFetch = async(slug) => {
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

const deleteAll = async (slug) => {
	try {
		const result = await fetch(wpApiSettings.root + `urlslab/v1${slug ? `/${slug}/delete-all` : ''}`, {
			method: 'DELETE',
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

// All files and caches cleaning
document.querySelector('#wp-admin-bar-urlslab-cache-clearall a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing All caches', status: 'info' });
	const responseJS = await deleteAll('js-cache');
	const responseCSS = await deleteAll('css-cache');
	const responseCloudFront = await getFetch('cache-rules/drop-cloudfront');

	if (responseCSS.ok && responseJS.ok && responseCloudFront.ok) {
		setNotification({ message: 'All caches deleted!', status: 'success' });
		return false;
	}
	setNotification({ message: 'Deleting all caches failed', status: 'error' });
});

// CSS files cleaning
document.querySelector('#wp-admin-bar-urlslab-cache-css a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing CSS cache', status: 'info' });
	const response = await deleteAll('css-cache');
	// const message = await response.json();

	if (response.ok) {
		setNotification({ message: 'All optimized CSS files deleted!', status: 'success' });
		return false;
	}
	setNotification({ message: message.message, status: 'error' });
});

// JS files cleaning
document.querySelector('#wp-admin-bar-urlslab-cache-js a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing JS cache', status: 'info' });
	const response = await deleteAll('js-cache');
	const message = await response.json();

	if (response.ok) {
		setNotification({ message: 'All optimized JS files deleted!', status: 'success' });
		return false;
	}
	setNotification({ message: message.message, status: 'error' });
});

// CSS and JS files cleaning
document.querySelector('#wp-admin-bar-urlslab-cache-css-js a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing CSS and JS cache', status: 'info' });
	const responseJS = await deleteAll('js-cache');
	const responseCSS = await deleteAll('css-cache');

	if (responseCSS.ok && responseJS.ok) {
		setNotification({ message: 'All optimized CSS and JS files deleted!', status: 'success' });
		return false;
	}
	setNotification({ message: 'Deleting cached CSS and JS files failed', status: 'error' });
});

// CLoudfront cache clean
document.querySelector('#wp-admin-bar-urlslab-cache-cloudfront a').addEventListener('click', async (event) => {
	event.preventDefault();
	setNotification({ message: 'Clearing Cloudfront cache', status: 'info' });
	const response = await getFetch('cache-rules/drop-cloudfront');
	const message = await response.json();

	if (response.ok) {
		setNotification({ message: 'Cloudfront cache invalidated!', status: 'success' });
		return false;
	}
	setNotification({ message: message.message, status: 'error' });
});
