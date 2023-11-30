/* eslint-disable no-console */
/* global wpApiSettings */
import { __ } from '@wordpress/i18n';
import { setNotification } from '../hooks/useNotifications';

export async function getFetch( slug, options ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1${ slug ? `/${ slug }` : '' }`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
		} );

		// if error handling is managed elsewhere, we can skip
		if ( ! options?.skipErrorHandling === true ) {
			handleApiError( slug, result );
		}

		if ( ! result.ok ) {
			handleApiError( slug, result );
		}

		return result;
	} catch ( error ) {
		return false;
	}
}

export async function postFetch( slug, object, options ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/${ slug }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( object ),
			signal: options?.signal,
		} );

		// if error handling is managed elsewhere, we can skip
		if ( ! options?.skipErrorHandling === true ) {
			handleApiError( slug, result );
		}
		/*
		if ( slug === 'web-vitals' ) {
			fetch( wpApiSettings.root + `urlslab/v1/web-vitals/charts/metric-type`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					'X-WP-Nonce': window.wpApiSettings.nonce,
				},
				credentials: 'include',
				body: JSON.stringify( object ),

			} ).then( ( response ) => {
				return response.json();
			} ).then( ( posts ) => {
				console.log( posts );
			} );
			console.log( JSON.stringify( object ) );
		}
		*/

		return result;
	} catch ( error ) {
		return false;
	}
}

export async function setModule( slug, object ) {
	try {
		const result = await fetch( wpApiSettings.root + `urlslab/v1/module/${ slug }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-WP-Nonce': window.wpApiSettings.nonce,
			},
			credentials: 'include',
			body: JSON.stringify( object ),
		} );

		handleApiError( slug, result );

		return result;
	} catch ( error ) {
		return false;
	}
}

export async function handleApiError( notificationId, response, options ) {
	if ( response.ok ) {
		return false;
	}

	const message = options?.message;
	const title = options?.title;
	let error = null;

	// try to parse response, in some edge cases parsing may crash
	try {
		error = await response.json();
	} catch ( e ) {
		//json parsing failed
		setNotification( notificationId, { title, message: message ? message : __( 'API request failed.' ), status: 'error' } );
		console.error( 'URLsLab: API response cannot be parsed.', e );
		return false;
	}

	// show message from response or custom message
	if ( error?.message ) {
		setNotification( notificationId, { title, message: message ? message : error.message, status: 'error' } );
		return false;
	}

	// error message in response not present, but custom provided
	if ( message ) {
		setNotification( notificationId, { title, message, status: 'error' } );
		return false;
	}

	// finally show general message
	setNotification( notificationId, { title, message: __( 'API request failed.' ), status: 'error' } );
}
