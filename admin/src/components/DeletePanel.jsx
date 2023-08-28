import { memo } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient, useMutation } from '@tanstack/react-query';

import useCloseModal from '../hooks/useCloseModal';
import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';

import { deleteAll } from '../api/deleteTableData';
import Button from '../elements/Button';

function DeletePanel( { title, text, button, action } ) {
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( );
	const queryClient = useQueryClient();
	const slug = useTableStore( ( state ) => state.slug );
	const { deleteMultipleRows } = useChangeRow();

	const handleDeleteAll = useMutation( {
		mutationFn: () => {
			return deleteAll( slug );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ slug ] );
		},
	} );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( operation === 'delete-all' ) {
			handleDeleteAll.mutate();
		}
		if ( operation === 'delete-selected' ) {
			deleteMultipleRows();
		}
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>
				<p>{ text }</p>
				<div className="flex">
					<Button className="ma-left" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
					<Button className="ml-s danger" onClick={ () => hidePanel( action ) }>{ button }</Button>
				</div>
			</div>
		</div>
	);
}

export default memo( DeletePanel );
