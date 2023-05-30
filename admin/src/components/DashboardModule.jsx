import { memo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation } from '@tanstack/react-query';
import useMainMenu from '../hooks/useMainMenu';

import Switch from '../elements/Switch';
import Tag from '../elements/Tag';

import { setModule } from '../api/fetching';
import '../assets/styles/components/_DashboardModule.scss';
import '../assets/styles/elements/_Button.scss';

function DashboardModule( { moduleId, title, children, isActive, tags } ) {
	const { __ } = useI18n();
	const [ active, setActive ] = useState( isActive );
	const { setActivePage } = useMainMenu();

	const handleSwitch = useMutation( {
		mutationFn: async () => {
			const response = await setModule( moduleId, { active: ! active } );
			return { response };
		},
		onSuccess: ( { response } ) => {
			if ( response.ok ) {
				setActive( ! active );
				return false;
			}
			setActive( isActive );
		},
	} );

	const iconPath = new URL( `../assets/images/modules/${ moduleId }.svg`, import.meta.url ).pathname;

	const { labels, labelsList } = tags;

	return (
		<div className={ `urlslab-dashboardmodule ${ handleSwitch.isLoading ? 'activating' : '' } ${ active ? 'active' : '' }` }>
			{ handleSwitch.isLoading
				? <div className="urlslab-dashboardmodule-activating">{ active ? __( 'Deactivating…' ) : __( 'Activating…' ) }</div>
				: ''
			}
			<div className="urlslab-dashboardmodule-top flex-tablet flex-align-center">
				{ iconPath
					? <img className="urlslab-dashboardmodule-icon fadeInto" src={ iconPath } alt={ title } />
					: null
				}

				<h3 className="urlslab-dashboardmodule-title">
					<button className={ `${ active ? 'active' : '' }` } onClick={ active ? () => setActivePage( moduleId ) : null }>
						{ title }
					</button>
				</h3>

				<Switch
					secondary
					onChange={ () => handleSwitch.mutate() }
					className="urlslab-dashboardmodule-switch ma-left"
					label={ '' }
					labelOff={ '' }
					defaultValue={ active }
				/>
			</div>

			<div className="urlslab-dashboardmodule-content">
				<p>{ children }</p>
				{ labels.length > 0 &&
				<div className="urlslab-dashboardmodule-tags">
					{ labels.map( ( tag ) => {
						const { name, color } = labelsList[ tag ];
						return <Tag key={ tag } autoTextColor={ color } className={ `midSize mr-s ${ ! color && 'bg-grey-lighter' }` } style={ color && { backgroundColor: color } }>{ name }</Tag>;
					} ) }
				</div>
				}
			</div>
		</div>
	);
}

export default memo( DashboardModule );
