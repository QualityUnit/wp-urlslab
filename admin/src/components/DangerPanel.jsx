import { useI18n } from '@wordpress/react-i18n';

import useCloseModal from '../hooks/useCloseModal';
import Button from '../elements/Button';

export default function DangerPanel( { title, text, button, handlePanel } ) {
	const { __ } = useI18n();
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );

	const hidePanel = ( operation ) => {
		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ () => hidePanel() }>
						<CloseIcon />
					</button>
				</div>
				<p>{ text }</p>
				<div className="flex">
					<Button className="ma-left simple" onClick={ () => hidePanel() }>{ __( 'Cancel' ) }</Button>
					<Button className="ml-s danger" onClick={ () => hidePanel( 'danger' ) }>{ button }</Button>
				</div>
			</div>
		</div>
	);
}
