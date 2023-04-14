import { Suspense, useEffect, useRef, useReducer } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import { cronAll } from '../api/cron';
// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import Notifications from './Notifications';
import Loader from './Loader';
import Button from '../elements/Button';
import NotificationsPanel from './NotificationsPanel';
import { ReactComponent as PlayIcon } from '../assets/images/icon-play.svg';
import headerReducer from '../lib/headerReducer';

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const runCron = useRef( false );
	const [ state, dispatch ] = useReducer( headerReducer, { cronRunning: false, cronTasksResult: [], cronPanelActive: false, cronPanelError: false } );

	const handleCronRunner = () => {
		let controller;
		dispatch( { type: 'setCronRun', cronRunning: ! state.cronRunning } );
		runCron.current = ! runCron.current;

		if ( runCron.current ) {
			dispatch( { type: 'setCronPanelError', cronPanelError: false } );
			cronAll( runCron, controller, ( cronTasksResult ) => dispatch( { type: 'setCronTasks', cronTasksResult } ), handleCronError );
		}
	};

	function handleCronError() {
		runCron.current = false;
		dispatch( { type: 'setCronPanelError', cronPanelError: true } );
		dispatch( { type: 'setCronRun', cronRunning: false } );
		setTimeout( handleCronRunner, 60000 );
	}

	useEffect( () => {
		if ( state.cronTasksResult?.length ) {
			dispatch( { type: 'setCronPanelError', cronPanelError: false } );
			dispatch( { type: 'setCronPanelActive', cronPanelActive: true } );
			setTimeout( () => {
				dispatch( { type: 'setCronPanelActive', cronPanelActive: false } );
				dispatch( { type: 'setCronTasks', cronTasksResult: [] } );
			}, 4000 );
		}
	}, [ state.cronPanelActive, state.cronTasksResult ] );

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
					<Button active className="pos-relative small ma-left" onClick={ handleCronRunner }>
						{ ! state.cronRunning
							? <><PlayIcon /> { __( 'Speed Up the Cron Execution' ) }</>
							: <><Loader className="mr-s noText small" /> { __( 'Stop Cron Execution' ) }</>
						}

						<NotificationsPanel className={ `${ state.cronPanelError ? 'error' : 'dark' } wide` } active={ ( state.cronTasksResult?.length > 0 && state.cronPanelActive ) || state.cronPanelError }>
							{ ! state.cronPanelError
								? state.cronTasksResult?.map( ( task ) => <div className="message" key={ task.task }>{ task.description }</div> )
								: <div className="message" key="cronError">{ __( 'Error has occured. Will run again in 1 min.' ) }</div>
							}
						</NotificationsPanel>
					</Button>
					{ /* <Notifications /> */ }
				</div>
				{ /* { apikey && apikey.length
					? null
					: <NoAPIkey />
				} */ }
			</header>
		</Suspense>
	);
}
