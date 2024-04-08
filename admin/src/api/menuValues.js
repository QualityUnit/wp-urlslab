import { withI18n } from '@wordpress/react-i18n';

const statusTypes = ( { __ } ) => {
	return {
		N: __( 'New', 'wp-urlslab' ),
		A: __( 'Available', 'wp-urlslab' ),
		P: __( 'Processing', 'wp-urlslab' ),
		D: __( 'Disabled', 'wp-urlslab' ),
	};
};

export default withI18n()( statusTypes() );
