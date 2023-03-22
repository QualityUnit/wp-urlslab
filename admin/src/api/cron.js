export async function cronAll( runCron, controller, cronTasks ) {
	controller = new AbortController();
	if ( ! runCron.current ) {
		controller.abort();
	}
	try {
		const response = await fetch( '/wp-json/urlslab/v1/cron/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			signal: controller.signal,
		} );
		const result = await response.json();
		const okResult = result?.filter( ( task ) => task.exec_time >= 5 );

		if ( okResult?.length && ! controller.signal.aborted ) {
			cronTasks( result );
			cronAll( runCron, controller, cronTasks );
		}
		if ( ! okResult?.length ) {
			setInterval( () => cronAll( runCron, controller, cronTasks ), 5000 );
		}
	} catch {
		return false;
	}
}
