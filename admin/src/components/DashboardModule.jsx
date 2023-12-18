import { memo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';

import { setModule } from '../api/fetching';
import { renameModule } from '../lib/helpers';

import Switch from '../elements/Switch';
import Tag from '../elements/Tag';

import useUserInfo from '../hooks/useUserInfo';

import '../assets/styles/components/_DashboardModule.scss';
import '../assets/styles/elements/_Button.scss';

function DashboardModule( { module, labelsList, showPaidModulePopup, onboardingData } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { isPaidUser } = useUserInfo();
	const { id: moduleId, active, title, description, labels, apikey: requireApiKey } = module;
	const isActive = onboardingData ? onboardingData.active : active;
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

	let iconPath = new URL( `../assets/images/modules/${ moduleId }.svg`, import.meta.url ).href;
	if ( iconPath.includes( 'undefined' ) ) {
		iconPath = new URL( `../assets/images/modules/urlslab-media-offloader.svg`, import.meta.url ).href;
	}

	return (
		<div
			className={
				classNames( [
					'urlslab-dashboardmodule',
					handleSwitch.isLoading ? 'activating' : null,
					isActive ? 'active' : null,
				] )
			}
		>
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
							to={ `/${ renameModule( moduleId ) }` }
							className="active"
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
					onChange={ ( checked ) => onboardingData?.activationCallback ? onboardingData.activationCallback( checked ) : handleSwitch.mutate() }
					className="urlslab-dashboardmodule-switch ma-left"
					label={ onboardingData ? __( 'Activate' ) : '' }
					labelOff={ onboardingData ? __( 'Deactivate' ) : '' }
					defaultValue={ isActive }
					remoteToggle={ onboardingData ? onboardingData.active : isActive }
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
