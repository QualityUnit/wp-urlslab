/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useRef, useReducer, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { cronAll } from '../api/cron';
import cronReducer from '../lib/cronReducer';

import NotificationsPanel from './NotificationsPanel';
import IconButton from '../elements/IconButton';

import { ReactComponent as CronIcon } from '../assets/images/icons/icon-cron-refresh.svg';
import { ReactComponent as StopIcon } from '../assets/images/icons/icon-cron-stop.svg';

import '../assets/styles/components/_CronRunner.scss';

export default function CronRunner() {
	const { __ } = useI18n();
	const runCron = useRef( false );
	const [ state, dispatch ] = useReducer( cronReducer, { cronRunning: false, cronTasksResult: [], cronPanelActive: false, cronPanelError: false } );

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
		<div className="urlslab-cronrunner pos-relative small" role="button" onClick={ handleCronRunner }>
			{ ! state.cronRunning
				? <IconButton
					tooltip={ __( 'Speed Up the Cron Execution' ) } tooltipClass="align-left xxxl"
				>
					<CronIcon className="urlslab-cronrunner-icon" />
				</IconButton>
				: <IconButton
					className="c-saturated-red"
					tooltip={ __( 'Stop Cron Execution' ) } tooltipClass="align-left xxxl"
				>
					<StopIcon className="urlslab-cronrunner-icon" />
				</IconButton>
			}

			<NotificationsPanel className={ `${ state.cronPanelError ? 'error' : 'dark' } wide` } active={ ( state.cronTasksResult?.length > 0 && state.cronPanelActive ) || state.cronPanelError }>
				{ ! state.cronPanelError
					? state.cronTasksResult?.map( ( task ) => <div className="message" key={ task.task }>{ task.description }</div> )
					: <div className="message" key="cronError">{ __( 'Error has occured. Will run again in 1 min.' ) }</div>
				}
			</NotificationsPanel>
		</div>
	);
}
