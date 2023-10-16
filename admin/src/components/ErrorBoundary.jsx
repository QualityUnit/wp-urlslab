/* eslint-disable no-console */
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

function ErrorPage( { error, resetErrorBoundary } ) {
	const { __ } = useI18n();

	return (
		<div className="urlslab-errorPage flex flex-align-center">
			<h2 className="urlslab-errorPage-title">{ __( 'Something went wrong…' ) } </h2>
			{ resetErrorBoundary && (
				<div className="mt-m urlslab-errorPage-error">
					<div>
						<strong>{ __( 'Error:' ) }&nbsp;</strong><pre style={ { color: 'red' } }>{ error.message }</pre>
					</div>

					<Button className="mt-m" onClick={ resetErrorBoundary }>
						{ __( 'Reload application' ) }
					</Button>
				</div>
			) }
		</div>
	);
}

export default function ErrorBoundary( { children } ) {
	return (
		<ReactErrorBoundary
			FallbackComponent={ ErrorPage }
			onError={ ( error, errorInfo ) => {
				// log the error
				console.log( 'Error caught!' );
				console.error( error );
				console.error( errorInfo );
			} }
			onReset={ () => {
				console.log( 'Reloading the page...' );
				window.location.reload();
			} }
		>
			{ children }
		</ReactErrorBoundary>
	);
}
