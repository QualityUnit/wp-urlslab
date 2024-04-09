import { memo } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';

const SimpleModal = ( {
	children,
	open,
	title,
	titleIcon,
	cancelButton,
	cancelButtonText,
	actionButton,
	hideCloseButton,

	onClose,
} ) => {
	return (
		<Modal
			open={ open }
			onClose={ onClose }
		>
			<ModalDialog variant="plain">
				{ ! hideCloseButton && <ModalClose /> }
				{ title &&
					<>
						<DialogTitle>
							{ titleIcon && titleIcon }
							{ title }
						</DialogTitle>
						<Divider />
					</>
				}
				<DialogContent>
					{ children }
				</DialogContent>
				<DialogActions>

					{ actionButton && actionButton }

					{ cancelButton &&
					<Button variant="plain" color="neutral" onClick={ onClose }>
						{ cancelButtonText ? cancelButtonText : __( 'Cancel', 'urlslab' ) }
					</Button>
					}
				</DialogActions>
			</ModalDialog>
		</Modal>
	);
};

export default memo( SimpleModal );
