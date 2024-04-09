import { withI18n } from '@wordpress/react-i18n';

const statusTypes = ( { __ } ) => {
	return {
		N: __( 'New', 'urlslab' ),
		A: __( 'Available', 'urlslab' ),
		P: __( 'Processing', 'urlslab' ),
		D: __( 'Disabled', 'urlslab' ),
	};
};

export default withI18n()( statusTypes() );
