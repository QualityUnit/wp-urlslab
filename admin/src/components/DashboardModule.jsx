import { useI18n } from '@wordpress/react-i18n';
import { useState } from 'react';
import Switch from '../elements/Switch';

import { setModule } from '../api/modules';
import { ReactComponent as ArrowIcon } from '../assets/images/icon-arrow.svg';
import { ReactComponent as ApiIcon } from '../assets/images/api-exclamation.svg';
import '../assets/styles/components/_DashboardModule.scss';
import Tooltip from '../elements/Tooltip';

export default function DashboardModule( { moduleId, image, isActive, title, hasApi, children } ) {
	const { __ } = useI18n();
	const [ moduleActive, setModuleActive ] = useState( isActive ? true : false );
	const [ activating, setIsActivating ] = useState( false );
	const handleSwitch = () => {
		setIsActivating( true );
		setModule( moduleId, { active: ! moduleActive } ).then( ( data ) => {
			if ( data ) {
				setModuleActive( data.active );
				setIsActivating( false );
			}
		}
		);
	};

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
				onChange={ ( ) => handleSwitch( isActive ) }
				className="urlslab-dashboardmodule-switch"
				label={ __( 'Activate module' ) }
				labelOff={ __( 'Deactivate module' ) }
				checked={ isActive }
			/>
			<div className="urlslab-dashboardmodule-main flex-tablet flex-align-center">
				{ image
					? <img className="urlslab-dashboardmodule-image" src={ image } alt={ title } />
					: null
				}

				<h3 className="urlslab-dashboardmodule-title">{ title }</h3>
				<div className="urlslab-dashboardmodule-content">
					<p>{ children }</p>
					<div className="urlslab-learnMore">{ __( 'Manage module' ) } <ArrowIcon /></div>
				</div>
			</div>
		</div>
	);
}
