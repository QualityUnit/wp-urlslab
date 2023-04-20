import useCheckApiKey from '../hooks/useCheckApiKey';
import DashboardModule from '../components/DashboardModule';

export default function Modules( { modules, activePage } ) {
	const { settingsLoaded, apiKeySet } = useCheckApiKey();

	if ( ! modules.length ) {
		return;
	}

	return (
		<>
			{ /* <SearchField onChange={ ( value ) => handleSearch( value ) } placeholder={ __( 'Search module…' ) } />
			*/ }
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{ modules.map( ( module ) => {
					// const title = module.title.toLowerCase();
					// const excerpt = module.description.toLowerCase();
					return (
						module.id !== 'general'
						// ( title.includes( searchValue ) || excerpt.includes( searchValue ) )
							? <DashboardModule
								key={ module.id }
								moduleId={ module.id }
								hasApi={ settingsLoaded && apiKeySet === false && module.apikey }
								isActive={ module.active }
								title={ module.title }
								activePage={ ( mod ) => activePage( mod ) }
							>
								{ module.description }
							</DashboardModule>
						// )
							: null
					);
				} )
				}
			</div>
		</>
	);
}
