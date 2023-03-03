import { useI18n } from '@wordpress/react-i18n';
import { useEffect } from 'react';
import Button from '../elements/Button';
import { ReactComponent as CloseIcon } from '../assets/images/icon-close.svg';

export default function DangerPanel( { title, text, button, handleDanger } ) {
	const { __ } = useI18n();

	const handleClose = ( operation ) => {
		document.querySelector( '#urlslab-root' ).classList.remove( 'dark' );
		if ( handleDanger ) {
			handleDanger( operation );
		}
	};

	useEffect( () => {
		window.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				handleClose();
			}
		}
		);
		document.querySelector( '#urlslab-root' ).classList.add( 'dark' );
	} );

	return (
		<div className="urlslab-panel-wrap urlslab-panel-floating fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ title }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<p>{ text }</p>
				<div className="flex">
					<Button className="ma-left simple" onClick={ handleClose }>{ __( 'Cancel' ) }</Button>
					<Button className="ml-s danger" onClick={ () => handleClose( 'danger' ) }>{ button }</Button>
				</div>
			</div>
		</div>
	);
}
