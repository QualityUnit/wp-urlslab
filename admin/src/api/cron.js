/* global wpApiSettings */
let timeoutId;

export async function cronAll( runCron, controller, cronTasks, onError ) {
	controller = new AbortController();
	if ( ! runCron.current ) {
		timeoutId = null;
		controller.abort();
		console.log( 'nebezime' );
		return false;
	}
	try {
		if ( runCron.current ) {
			console.log( 'bezime' );
			timeoutId = setTimeout( () => controller.abort(), 60000 ); // 1 minute timeout
		}
		const response = await fetch( wpApiSettings.root + 'urlslab/v1/cron/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			signal: controller.signal,
		} );
		if ( runCron.current ) {
			clearTimeout( timeoutId );
		}

		if ( response.ok ) {
			const result = await response.json();
			const okResult = result?.filter( ( task ) => task.exec_time >= 5 );

			if ( okResult?.length && ! controller.signal.aborted ) {
				cronTasks( result );
				cronAll( runCron, controller, cronTasks, onError );
			}
			if ( ! okResult?.length ) {
				setTimeout( () => cronAll( runCron, controller, cronTasks, onError ), 5000 );
			}
		}
		if ( ! response.ok ) {
			onError( 'error' );
			return false;
		}

		return response;
	} catch ( err ) {
		timeoutId = null;
		onError( 'error' );
		return false;
	}
}
