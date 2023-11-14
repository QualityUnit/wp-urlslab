import { __ } from '@wordpress/i18n';
import hexToHSL from '../lib/hexToHSL';
import { postFetch } from '../api/fetching';
import { setNotification } from '../hooks/useNotifications';

const maxProcessingAttempts = 3;

export const preprocessUrls = async ( data, processing = 0, signal ) => {
	try {
		setNotification( 'serp-gap/prepare/download-failed', {
			title: __( 'Downloading URLs...' ),
			message: __( 'It can take few minutes.' ),
			status: 'info',
		} );

		const response = await postFetch( 'serp-gap/prepare', data, { signal, skipErrorHandling: true } );

		if ( response === false ) {
			throw 'cancelled';
		}

		if ( response.status === 200 ) {
			const results = await response.json();
			return validateResults( results );
		}

		if ( response.status === 404 ) {
			if ( processing < maxProcessingAttempts ) {
				return await preprocessUrls( data, processing + 1 );
			}
			const results = await response.json();
			return validateResults( results );
		}

		if ( response.status === 400 ) {
			const results = await response.json();
			if ( results.message ) {
				throw new Error( results.message );
			}
			return validateResults( results );
		}

		throw new Error( 'Failed to process URLs.' );
	} catch ( error ) {
		if ( error !== 'cancelled' ) {
			setNotification( 'serp-gap/prepare/error', { message: error.message, status: 'error' } );
		}
		return false;
	}
};

const validateResults = ( results ) => {
	const withError = Object.values( results ).filter( ( urlData ) => urlData.status === 'error' );
	if ( withError.length ) {
		setNotification( 'serp-gap/prepare/download-failed', {
			title: __( 'Download of some URLs failed.' ),
			message: __( 'Some data will not be present in table.' ),
			status: 'error',
		} );
	}
	return results;
};

export const colorRankingBackground = ( val ) => {
	const value = Number( val );
	const okColor = '#EEFFEE'; // light green
	const failColor = '#FFEEEE'; // light red

	if ( typeof value === 'number' && value < 0 ) {
		return { backgroundColor: '#EEEEEE' };
	}

	if ( typeof value !== 'number' || value === 0 || value > 50 ) {
		const { h, s } = hexToHSL( failColor );
		const l = 70;
		return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
	}

	if ( value > 0 && value <= 10 ) {
		const { h, s } = hexToHSL( okColor );
		const l = ( 70 + ( value * 2 ) );
		return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
	}
	const { h, s } = hexToHSL( failColor );
	const l = ( 100 - ( value / 3 ) );
	return { backgroundColor: `hsl(${ h }, ${ s }%, ${ l }%)` };
};

export const colorRankingInnerStyles = ( { position, words } ) => {
	const styles = {};

	if ( position !== null ) {
		const value = Number( position );
		if ( value > 0 && value <= 50 ) {
			styles[ '--position-color' ] = '#000000';
		} else {
			styles[ '--position-color' ] = '#FFFFFF';
		}
	}

	if ( words !== null ) {
		const value = Number( words );
		if ( value > 0 && value <= 20 ) {
			styles[ '--words-backgroundColor' ] = '#2CA34D'; // green light
		} else if ( value > 20 && value <= 50 ) {
			styles[ '--words-backgroundColor' ] = '#187E36'; // green medium
		} else if ( value > 50 ) {
			styles[ '--words-backgroundColor' ] = '#106228'; // green dark
		}
	}

	return styles;
};

export const emptyUrls = ( urls ) => {
	if ( ! urls || ( urls && Object.keys( urls ).length === 0 ) ) {
		return true;
	}

	return Object.values( urls ).filter( ( url ) => url !== '' ).length
		? false
		: true;
};
