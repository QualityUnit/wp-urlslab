import { Suspense, useState, useEffect, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import Notifications from './Notifications';
import Button from '../elements/Button';
import NotificationsPanel from './NotificationsPanel';

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const runCron = useRef( false );
	const [ cronRunning, setCronRun ] = useState( false );
	const [ cronTasksResult, setCronTasks ] = useState( [] );
	const [ panelActive, setPanelActive ] = useState( false );

	const handleCronRunner = () => {
		let controller;
		setCronRun( ! cronRunning );
		runCron.current = ! runCron.current;

		async function cronAll( cronTasks ) {
			controller = new AbortController();
			if ( ! runCron.current ) {
				controller.abort();
			}
			const result = await fetch( '/wp-json/urlslab/v1/cron/all', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					'X-WP-Nonce': window.wpApiSettings.nonce,
				},
				credentials: 'include',
				signal: controller.signal,
			} ).then( ( response ) => response.json() ).catch( ( error ) => {
				throw error;
			} );

			const okResult = result?.filter( ( task ) => task.exec_time >= 5 );

			if ( okResult?.length ) {
				cronTasks( result );
				cronAll( cronTasks );
			}
			if ( ! okResult?.length ) {
				setInterval( () => cronAll( cronTasks ), 5000 );
			}
			return false;
		}
		if ( runCron.current ) {
			cronAll( ( cronTasks ) => setCronTasks( cronTasks ) );
		}
	};

	useEffect( () => {
		if ( cronTasksResult?.length ) {
			setPanelActive( true );
			setTimeout( () => {
				setPanelActive( false );
				setCronTasks( [] );
			}, 3000 );
		}
	}, [ panelActive, cronTasksResult?.length ] );

	return (
		<Suspense>
			<header className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title">{ pageTitle }</h1>
					<Button active className="pos-relative small ma-left" onClick={ handleCronRunner }>
						{ ! cronRunning
							? __( 'Accelerate Cron Execution' )
							: __( 'Stop Cron Execution' )
						}
						{
							cronTasksResult.length > 0 &&
							<NotificationsPanel className="wide" active={ panelActive }>{ cronTasksResult.map( ( task ) => <div className="message" key={ task.task }>{ task.description }</div> ) }</NotificationsPanel>
						}
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
