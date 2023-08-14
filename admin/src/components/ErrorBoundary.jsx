import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import Button from '../elements/Button';

function ErrorPage( { error, resetErrorBoundary } ) {
	return (
		<div className="urlslab-errorPage flex flex-align-center">
			<h2 className="urlslab-errorPage-title">Something went wrong...</h2>
			{ resetErrorBoundary && (
				<div className="mt-m urlslab-errorPage-error">
					<div>
						<strong>Error:&nbsp;</strong><pre style={ { color: 'red' } }>{ error.message }</pre>
					</div>

					<Button active className="mt-m" onClick={ resetErrorBoundary }>
						Reload application
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
