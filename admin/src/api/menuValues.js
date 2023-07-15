import { withI18n } from '@wordpress/react-i18n';

const statusTypes = ( { __ } ) => {
	return {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};
};

export default withI18n()( statusTypes() );
