import { useI18n } from '@wordpress/react-i18n';
import '../assets/styles/components/_MainMenu.scss';

export default function MainMenu( { modules, activePage } ) {
	const { __ } = useI18n();
	const handleActive = ( module ) => {
		if ( activePage ) {
			activePage( module );
		}
	};

	return (
		<ul className={ `urlslab-mainmenu` }>
			<li key="urlslab-modules"><button type="button" onClick={ () => handleActive( null ) }>{ __( 'Modules' ) }</button></li>
			{ modules.length
				? modules.map( ( module ) => {
					return (
						module.active
							? <li key={ module.id } ><button type="button" onClick={ () => handleActive( module.id ) }>{ module.title }</button></li>
							: ''
					);
				} )
				: ''
			}
			<li key="urlslab-settings"><button type="button" onClick={ () => handleActive( 'urlslab-settings' ) }>{ __( 'Settings' ) }</button></li>
		</ul>
	);
}
