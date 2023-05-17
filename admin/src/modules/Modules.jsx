import useCheckApiKey from '../hooks/useCheckApiKey';
import DashboardModule from '../components/DashboardModule';

export default function Modules( { modules, activePage } ) {
	const { settingsLoaded, apiKeySet } = useCheckApiKey();

	if ( ! modules.length ) {
		return;
	}

	const labelsList = {
		paid: { name: 'Paid service', color: '#75E9DB' },
		free: { name: 'Free' },
		experimental: { name: 'Experimental', color: '#ff492b' },
		beta: { name: 'Beta', color: '#2570ED' },
		alpha: { name: 'Alpha' },
		expert: { name: 'Expert' },
		seo: { name: 'SEO', color: '#D4C5F9' },
		cron: { name: 'Cron' },
		performance: { name: 'Performance', color: '#65B5FF' },
		tools: { name: 'Tools', color: '#FFD189' },
	};

	return (
		<>
			{ /* <SearchField onChange={ ( value ) => handleSearch( value ) } placeholder={ __( 'Search module…' ) } />
			*/ }
			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{ modules.map( ( module ) => {
					const { id, apikey, active, title, description, labels } = module;
					// const title = module.title.toLowerCase();
					// const excerpt = module.description.toLowerCase();
					return (
						module.id !== 'general'
						// ( title.includes( searchValue ) || excerpt.includes( searchValue ) )
							? <DashboardModule
								key={ id }
								moduleId={ id }
								hasApi={ settingsLoaded && apiKeySet === false && apikey }
								isActive={ active }
								title={ title }
								tags={ { labels, labelsList } }
								activePage={ ( mod ) => activePage( mod ) }
							>
								{ description }
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
