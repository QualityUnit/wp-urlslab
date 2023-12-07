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
import useModuleGroups from '../hooks/useModuleGroups';
import useUserInfo from '../hooks/useUserInfo';

function DashboardModule( { module, labelsList, showPaidModulePopup, onboardingData } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const setActiveGroup = useModuleGroups( ( state ) => state.setActiveGroup );
	const { isPaidUser } = useUserInfo();
	const { id: moduleId, active: isActive, title, description, labels, apikey: requireApiKey } = module;

	const disallowForFreeUser = ! isActive && requireApiKey && ( onboardingData ? onboardingData.userPlan === 'free' : ! isPaidUser );

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
					{ ( onboardingData || ! isActive )
						? title
						: <Link
							to={ renameModule( moduleId ) }
							className="active"
							onClick={ () => setActiveGroup( {} ) }
						>
							{ title }
						</Link>
					}
				</h3>

				{ ( onboardingData?.userPlan === 'free' && requireApiKey ) &&
					<Tag color="#00c996" size="sm">{ __( 'Paid' ) }</Tag>
				}

				<Switch
					secondary
					id={ moduleId }
					onClick={ disallowForFreeUser && showPaidModulePopup
						? () => showPaidModulePopup()
						: null
					}
					onChange={ () => handleSwitch.mutate() }
					className="urlslab-dashboardmodule-switch ma-left"
					label={ onboardingData ? __( 'Activate' ) : '' }
					labelOff={ onboardingData ? __( 'Deactivate' ) : '' }
					defaultValue={ isActive }
				/>
			</div>

			<div className="urlslab-dashboardmodule-content">
				<p>{ description }</p>
				{ labels.length && ! onboardingData &&
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
