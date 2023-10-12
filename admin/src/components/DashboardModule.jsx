import { memo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';

import { setModule } from '../api/fetching';
import { renameModule } from '../lib/helpers';

import Switch from '../elements/Switch';
import Tag from '../elements/Tag';

import '../assets/styles/components/_DashboardModule.scss';
import '../assets/styles/elements/_Button.scss';

function DashboardModule( { module, labelsList, isOnboardingItem } ) {
	const { __ } = useI18n();
	const { id: moduleId, active: isActive, title, description, labels } = module;
	const queryClient = useQueryClient();
	const handleSwitch = useMutation( {
		mutationFn: async () => {
			const response = await setModule( moduleId, { active: ! isActive } );
			return { response };
		},
		onSuccess: ( { response } ) => {
			if ( response.ok ) {
				queryClient.setQueryData( [ 'modules' ], ( data ) => {
					return {
						...data, [ moduleId ]: { ...data[ moduleId ], active: ! isActive },
					};
				} );
				return false;
			}
		},
	} );

	let iconPath = new URL( `../assets/images/modules/${ moduleId }.svg`, import.meta.url ).pathname;
	if ( iconPath.includes( 'undefined' ) ) {
		iconPath = new URL( `../assets/images/modules/urlslab-media-offloader.svg`, import.meta.url ).pathname;
	}

	return (
		<div className={ `urlslab-dashboardmodule ${ handleSwitch.isLoading ? 'activating' : '' } ${ isActive ? 'active' : '' }` }>
			{ handleSwitch.isLoading
				? <div className="urlslab-dashboardmodule-activating">{ isActive ? __( 'Deactivating…' ) : __( 'Activating…' ) }</div>
				: ''
			}
			<div className="urlslab-dashboardmodule-top flex-tablet flex-align-center">
				{ iconPath
					? <img className="urlslab-dashboardmodule-icon fadeInto" src={ iconPath } alt={ title } />
					: null
				}

				<h3 className="urlslab-dashboardmodule-title">
					{ ( isOnboardingItem || ! isActive )
						? title
						: <Link
							to={ renameModule( moduleId ) }
							className="active"
						>
							{ title }
						</Link>
					}
				</h3>

				<Switch
					secondary
					onChange={ () => handleSwitch.mutate() }
					className="urlslab-dashboardmodule-switch ma-left"
					label={ isOnboardingItem ? __( 'Activate' ) : '' }
					labelOff={ isOnboardingItem ? __( 'Deactivate' ) : '' }
					defaultValue={ isActive }
				/>
			</div>

			<div className="urlslab-dashboardmodule-content">
				<p>{ description }</p>
				{ labels.length && ! isOnboardingItem > 0 &&
				<div className="urlslab-dashboardmodule-tags">
					{ labels.map( ( tag ) => {
						const { name, color } = labelsList[ tag ];
						return <Tag key={ tag } color={ color } sx={ { mr: 1 } } >{ name }</Tag>;
					} ) }
				</div>
				}
			</div>
		</div>
	);
}

export default memo( DashboardModule );
