/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* global wpApiSettings */
import { useRef, useReducer, useCallback, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import cronReducer from '../lib/cronReducer';

import Tooltip from '../elements/Tooltip';
import SvgIcon from '../elements/SvgIcon';

import '../assets/styles/components/_CronRunner.scss';

export default function CronRunner() {
	const { __ } = useI18n();
	const cronController = useRef( null );
	const [ state, dispatch ] = useReducer( cronReducer, { cronRunning: false, cronTasksResult: [], cronPanelActive: false, cronPanelError: false } );
	const timeoutId = useRef();

	const cancelCron = useCallback( () => cronController?.current ? cronController.current.abort() : null, [] );

	const handleCronRunner = useCallback( ( clicked ) => {
		if ( clicked && state.cronRunning ) {
			dispatch( { type: 'setCronRun', cronRunning: false } );
			dispatch( { type: 'setCronPanelError', cronPanelError: false } );
			cancelCron();
			return false;
		}
		dispatch( { type: 'setCronRun', cronRunning: true } );
		dispatch( { type: 'setCronPanelError', cronPanelError: false } );
	}, [ state.cronRunning, cancelCron ] );

	const handleCronError = useCallback( () => {
		dispatch( { type: 'setCronPanelError', cronPanelError: true } );
		dispatch( { type: 'setCronRun', cronRunning: false } );
		setTimeout( handleCronRunner, 60000 );
	}, [ handleCronRunner ] );

	useEffect( () => {
		if ( state.cronRunning ) {
			cronController.current = new AbortController();
			const cronAll = async ( unlock ) => {
				try {
					if ( cronController.current ) {
						timeoutId.current = setTimeout( () => cancelCron(), 60000 ); // 1 minute timeout
					}
					const paramSymbol = wpApiSettings.root.includes( '?' ) ? '&' : '?';
					const response = await fetch( wpApiSettings.root + `urlslab/v1/cron/all${ paramSymbol }unlock=` + ( unlock ? 1 : 0 ), {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							accept: 'application/json',
							'X-WP-Nonce': window.wpApiSettings.nonce,
						},
						credentials: 'include',
						signal: cronController.current.signal,
					} );

					if ( cronController.current ) {
						clearTimeout( timeoutId.current );
					}

					if ( response.ok ) {
						const result = await response.json();
						const okResult = result?.filter( ( task ) => task.exec_time >= 5 );

						if ( okResult?.length && ! cronController.current.signal.aborted ) {
							cronAll( false );
						}
						if ( ! okResult?.length && result.length ) {
							setTimeout( () => cronAll( false ), 5000 );
						}
						if ( ! result.length && ! cronController.current.signal.aborted ) {
							setTimeout( () => cronAll( false ), 300000 ); // if no results returned, run again after 5 minutes
						}
					}
					if ( ! response.ok && ! cronController.current.signal.aborted ) {
						handleCronError( 'error' );
						return false;
					}

					return response;
				} catch ( err ) {
					timeoutId.current = null;
					if ( ! cronController.current.signal.aborted ) {
						handleCronError( 'error' );
						return false;
					}
					return true;
				}
			};
			cronAll( true );
		}
	}, [ state.cronRunning, cancelCron, handleCronRunner ] );

	return (
		<button className="urlslab-cronrunner pos-relative small" onClick={ () => handleCronRunner( true ) }>
			{ ! state.cronRunning
				? <span>
					<SvgIcon className="urlslab-cronrunner-icon" name="cron-speedup" />
					<Tooltip className="showOnHover align-left xxxl">{ __( 'Speed Up Cron Tasks Execution' ) }</Tooltip>
				</span>
				: <span className="c-saturated-red">
					<SvgIcon className="urlslab-cronrunner-icon" name="cron-stop" />
					<Tooltip className="showOnHover align-left xxxl">{ __( 'Stop Cron Tasks Execution' ) }</Tooltip>
				</span>
			}
		</button>
	);
}
