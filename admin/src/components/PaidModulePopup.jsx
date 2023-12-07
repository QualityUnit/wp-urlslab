import { __ } from '@wordpress/i18n';

import SimpleModal from '../elements/SimpleModal';
import Button from '@mui/joy/Button';

const PaidModulePopup = ( { open, onClose, actionCallback } ) => {
	return (
		<SimpleModal
			open={ open }
			title={ __( 'Paid module' ) }
			cancelButtonText={ 'Continue with free plan' }
			onClose={ onClose }
			actionButton={
				<Button onClick={ () => actionCallback() }>
					{ __( 'Insert API Key' ) }
				</Button>
			}
			cancelButton
		>
			{ __( 'You are trying to activate paid module. API Key is required to continue.' ) }
		</SimpleModal>
	);
};

export default PaidModulePopup;
