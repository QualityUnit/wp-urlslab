import { Suspense, useState, useEffect, useRef } from 'react';
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

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const runCron = useRef( false );
	const [ cronRunning, setCronRun ] = useState( false );
	const [ cronTasksResult, setCronTasks ] = useState( [] );
	const [ cronPanelActive, setCronPanelActive ] = useState( false );
	const [ cronPanelError, setCronPanelError ] = useState( false );

	const handleCronRunner = () => {
		let controller;
		setCronRun( ! cronRunning );
		runCron.current = ! runCron.current;

		if ( runCron.current ) {
			setCronPanelError( false );
			cronAll( runCron, controller, ( cronTasks ) => setCronTasks( cronTasks ), handleCronError );
		}
	};

	function handleCronError() {
		runCron.current = false;
		setCronPanelError( true );
		setCronRun( false );
		setTimeout( handleCronRunner, 60000 );
	}

	useEffect( () => {
		if ( cronTasksResult?.length ) {
			setCronPanelError( false );
			setCronPanelActive( true );
			setTimeout( () => {
				setCronPanelActive( false );
				setCronTasks( [] );
			}, 4000 );
		}
	}, [ cronPanelActive, cronTasksResult?.length ] );

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
					<Button active className="pos-relative small ma-left" onClick={ handleCronRunner }>
						{ ! cronRunning
							? <><PlayIcon /> { __( 'Accelerate the Cron Execution' ) }</>
							: <><Loader className="mr-s noText small" /> { __( 'Stop Cron Execution' ) }</>
						}

						<NotificationsPanel className={ `${ cronPanelError ? 'error' : 'dark' } wide` } active={ ( cronTasksResult.length > 0 && cronPanelActive ) || cronPanelError }>
							{ ! cronPanelError
								? cronTasksResult.map( ( task ) => <div className="message" key={ task.task }>{ task.description }</div> )
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
