// import { useState } from 'react';
import { publicDir } from '../constants/variables';
import DashboardModule from '../components/DashboardModule';
// import SearchField from '../elements/SearchField';

export default function Modules( { modules, onChange } ) {
	// const [ searchValue, setSearchVal ] = useState( '' );

	const handleOnChange = ( moduleId, activated ) => {
		if ( onChange ) {
			onChange( moduleId, activated );
		}
	};

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
						// ( title.includes( searchValue ) || excerpt.includes( searchValue ) )
					// ? (
						<DashboardModule
							key={ module.id }
							moduleId={ module.id }
							hasApi={ module.apikey }
							isActive={ module.active }
							onChange={ ( moduleId, activated ) => handleOnChange( moduleId, activated ) }
							title={ module.title }
							image={ `${ publicDir() }/images/modules/${ module.id }.png` }
						>
							{ module.description }
						</DashboardModule>
					// )
					// : null
					);
				} )
				}
			</div>
		</>
	);
}
