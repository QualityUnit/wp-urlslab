import { useI18n } from '@wordpress/react-i18n';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Switch from '../elements/Switch';
import Tag from '../elements/Tag';

import { setModule } from '../api/fetching';
import { ReactComponent as ArrowIcon } from '../assets/images/icons/icon-arrow.svg';
import '../assets/styles/components/_DashboardModule.scss';
import '../assets/styles/elements/_Button.scss';

export default function DashboardModule( { moduleId, title, children, isActive, tags, activePage } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const handleSwitch = useMutation( {
		mutationFn: () => {
			return setModule( moduleId, { active: ! isActive } );
		},
		onSuccess: ( ) => {
			queryClient.setQueryData( [ 'modules', moduleId.active ], ! isActive );
			queryClient.invalidateQueries( [ 'modules' ] );
		},
	} );

	const handleActive = ( module ) => {
		if ( activePage ) {
			activePage( module );
		}
	};

	const iconPath = new URL( `../assets/images/modules/${ moduleId }.svg`, import.meta.url ).pathname;

	const { labels, labelsList } = tags;

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

				<h3 className="urlslab-dashboardmodule-title">{ title }</h3>

				{ labelsList.beta &&
					<Tag className="midSize c-white bg-primary-color">BETA</Tag>
				}

				<Switch
					secondary
					onChange={ () => handleSwitch.mutate() }
					className="urlslab-dashboardmodule-switch ma-left"
					label={ __( 'Activate' ) }
					labelOff={ __( 'Deactivate' ) }
					checked={ isActive }
				/>
			</div>

			<div className="urlslab-dashboardmodule-content">
				<p>{ children }</p>
				{ labels.length > 0 &&
				<div className="urlslab-dashboardmodule-tags">
					{ labels.map( ( tag ) => {
						const { name, color } = labelsList[ tag ];
						return tag !== 'beta' &&
						<Tag key={ tag } className={ `midSize smallText mr-s ${ ! color && 'bg-grey-lighter' }` } style={ color && { backgroundColor: color } }>{ name }</Tag>;
					} ) }
				</div>
				}
				{ isActive
					? <button className="urlslab-learnMore ma-top c-black" onClick={ () => handleActive( moduleId ) }>
						{ __( 'Manage plugin' ) } <ArrowIcon />
					</button>
					: null
				}
			</div>
		</div>
	);
}
