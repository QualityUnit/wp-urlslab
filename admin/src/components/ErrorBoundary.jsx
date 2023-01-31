import React from 'react';
import { withI18n } from '@wordpress/react-i18n';

class ErrorBoundary extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch( error, errorInfo ) {
		this.setState( {
			error,
			errorInfo,
		} );
	}

	render() {
		if ( this.state.errorInfo ) {
			return (
				<div>
					<h2>{ this.props.__( 'Something went wrong.' ) }</h2>
					<details style={ { whiteSpace: 'pre-wrap' } }>
						{ this.state.error && this.state.error.toString() }
						<br />
						{ this.state.errorInfo.componentStack }
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

export default withI18n( ErrorBoundary );
