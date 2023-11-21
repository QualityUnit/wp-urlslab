/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* global wpApiSettings */
import { useRef, useReducer, useCallback, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import cronReducer from '../lib/cronReducer';

// import NotificationsPanel from './NotificationsPanel';
import Tooltip from '../elements/Tooltip';
import SvgIcon from '../elements/SvgIcon';

import '../assets/styles/components/_CronRunner.scss';

export default function CronRunner() {
	const { __ } = useI18n();
	const cronController = useRef( null );
	const [ state, dispatch ] = useReducer( cronReducer, { cronRunning: false, cronTasksResult: [], cronPanelActive: false, cronPanelError: false } );
	const timeoutId = useRef();

	const cancelCron = useCallback( () => cronController.current ? cronController.current.abort() : null, [] );

	const handleCronRunner = useCallback( () => {
		cancelCron();
		dispatch( { type: 'setCronRun', cronRunning: ! state.cronRunning } );
		dispatch( { type: 'setCronPanelError', cronPanelError: false } );
	}, [ state.cronRunning, cancelCron ] );

	const handleCronError = useCallback( () => {
		// cronController.current = false;
		dispatch( { type: 'setCronPanelError', cronPanelError: true } );
		dispatch( { type: 'setCronRun', cronRunning: false } );
		setTimeout( handleCronRunner, 60000 );
	}, [ handleCronRunner ] );

	useEffect( () => {
		cancelCron();
		cronController.current = new AbortController();
		if ( state.cronRunning ) {
			const cronAll = async () => {
				try {
					if ( cronController.current ) {
						timeoutId.current = setTimeout( () => cancelCron(), 60000 ); // 1 minute timeout
					}
					const response = await fetch( wpApiSettings.root + 'urlslab/v1/cron/all', {
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
							cronAll();
						}
						if ( ! okResult?.length ) {
							setTimeout( () => cronAll(), 5000 );
						}
					}
					if ( ! response.ok ) {
						handleCronError( 'error' );
						return false;
					}

					return response;
				} catch ( err ) {
					timeoutId.current = null;
					handleCronError( 'error' );
					return false;
				}
			};
			cronAll();
		}
	}, [ state.cronRunning, cancelCron, handleCronRunner, handleCronError ] );

	// useEffect( () => {
	// 	if ( state.cronTasksResult?.length ) {
	// 		dispatch( { type: 'setCronPanelError', cronPanelError: false } );
	// 		dispatch( { type: 'setCronPanelActive', cronPanelActive: true } );
	// 		setTimeout( () => {
	// 			dispatch( { type: 'setCronPanelActive', cronPanelActive: false } );
	// 			dispatch( { type: 'setCronTasks', cronTasksResult: [] } );
	// 		}, 4000 );
	// 	}
	// }, [ state.cronPanelActive, state.cronTasksResult ] );

	return (
		<button className="urlslab-cronrunner pos-relative small" onClick={ handleCronRunner }>
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
			{ /*
			<NotificationsPanel className={ `${ state.cronPanelError ? 'error' : 'dark' } wide` } active={ ( state.cronTasksResult?.length > 0 && state.cronPanelActive ) || state.cronPanelError }>
				{ ! state.cronPanelError
					? state.cronTasksResult?.map( ( task ) => <div className="message" key={ task.task }>{ task.description }</div> )
					: <div className="message" key="cronError">{ __( 'Error has occured. Will run again in 1 min.' ) }</div>
				}
			</NotificationsPanel> */ }
		</button>
	);
}
