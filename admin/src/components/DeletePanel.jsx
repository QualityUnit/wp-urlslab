import { memo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import useCloseModal from '../hooks/useCloseModal';
import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';

import { deleteAll } from '../api/deleteTableData';

import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';

function DeletePanel( { title, text, buttonText, buttonIcon, action } ) {
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( );
	const queryClient = useQueryClient();
	const [ deleteProgress, setDeleteProgress ] = useState( 0 );
	const slug = useTableStore( ( state ) => state.activeTable );
	const { deleteMultipleRows } = useChangeRow();

	const handleDeleteStatus = () => {
		setDeleteProgress( 1 );

		setInterval( () => {
			setDeleteProgress( ( val ) => val < 95 ? val + 5 : val );
		}, 500 );
	};

	const handleDeleteAll = useMutation( {
		mutationFn: async () => {
			const result = await deleteAll( slug );
			return { result };
		},
		onSuccess: ( { result } ) => {
			if ( result.ok ) {
				setDeleteProgress( 100 );
				clearInterval( );
				handleClose();
				queryClient.invalidateQueries( [ slug ] );
			}
		},
	} );

	const hidePanel = ( operation ) => {
		if ( operation === 'delete-all' ) {
			handleDeleteStatus();
			handleDeleteAll.mutate();
		}
		if ( operation === 'delete-selected' ) {
			deleteMultipleRows();
			handleClose();
		}
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ () => handleClose() }>
						<CloseIcon />
					</button>
				</div>
				<p>{ text }</p>
				{ deleteProgress > 0
					? <ProgressBar className="mb-m" notification="Deleting…" value={ deleteProgress } />
					: null
				}
				<div className="flex">
					<Button
						color="neutral"
						variant="plain"
						onClick={ () => handleClose() }
						sx={ { ml: 'auto' } }
					>
						{ __( 'Cancel', 'urlslab' ) }
					</Button>
					<Button
						color="danger"
						onClick={ () => hidePanel( action ) }
						startDecorator={ buttonIcon ? buttonIcon : null }
						sx={ { ml: 1 } }
					>
						{ buttonText }
					</Button>
				</div>
			</div>
		</div>
	);
}

export default memo( DeletePanel );
