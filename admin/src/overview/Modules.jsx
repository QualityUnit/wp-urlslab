import { publicDir } from '../constants/variables';
import DashboardModule from '../components/DashboardModule';
// import SearchField from '../elements/SearchField';

export default function Modules( { modules } ) {
	// const [ searchValue, setSearchVal ] = useState( '' );

	// const handleSearch = ( value ) => {
	// 	setSearchVal( value );
	// };

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
								hasApi={ module.apikey }
								isActive={ module.active }
								title={ module.title }
								image={ `${ publicDir() }/images/modules/${ module.id }.png` }
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
