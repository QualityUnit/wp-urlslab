import { useI18n } from '@wordpress/react-i18n';
import { useState } from 'react';
import Switch from '../elements/Switch';

import { setModule } from '../api/modules';
// import { fetchSettings, processSettings } from '../api/settings';
import { ReactComponent as ArrowIcon } from '../assets/images/icon-arrow.svg';
import { ReactComponent as ApiIcon } from '../assets/images/api-exclamation.svg';
import '../assets/styles/components/_DashboardModule.scss';
import '../assets/styles/elements/_Button.scss';

export default function DashboardModule( { moduleId, title, children, image, isActive, onChange, hasApi } ) {
	const { __ } = useI18n();
	const [ moduleActive, setModuleActive ] = useState( isActive ? true : false );
	const [ activating, setIsActivating ] = useState( false );
	const handleSwitch = () => {
		setIsActivating( true );
		setModule( moduleId, { active: ! moduleActive } ).then( ( data ) => {
			if ( data ) {
				setModuleActive( data.active );
				onChange( data.id, data.active );
				setIsActivating( false );
			}
		}
		);
	};

	// const handleModuleSettings = () => {
	// 	fetchSettings( moduleId ).then( ( settings ) => {
	// 		if ( settings ) {
	// 			setModuleSettings( settings );
	// 		}
	// 	} );
	// };

	return (
		<div className={ `urlslab-dashboardmodule ${ activating ? 'activating' : '' } ${ moduleActive ? 'active' : '' }` }>
			{ hasApi
				? <div className="urlslab-dashboardmodule-api">
					<ApiIcon />
					{ __( 'Urlslab API key required' ) }
				</div>
				: ''
			}
			{ activating
				? <div className="urlslab-dashboardmodule-activating">{ moduleActive ? __( 'Dectivating…' ) : __( 'Activating…' ) }</div>
				: ''
			}
			<Switch
				secondary
				onChange={ ( ) => handleSwitch( ) }
				className="urlslab-dashboardmodule-switch"
				label={ __( 'Activate module' ) }
				labelOff={ __( 'Deactivate module' ) }
				checked={ moduleActive }
			/>
			<div className="urlslab-dashboardmodule-main flex-tablet flex-align-center">
				{ image
					? <img className="urlslab-dashboardmodule-image" src={ image } alt={ title } />
					: null
				}

				<h3 className="urlslab-dashboardmodule-title">{ title }</h3>
				<div className="urlslab-dashboardmodule-content">
					<p>{ children }</p>
					<button
						className="urlslab-learnMore"
					// onClick={ () => handleModuleSettings() }
					>{ __( 'Manage module' ) } <ArrowIcon /></button>
				</div>
			</div>
		</div>
	);
}
