// eslint-disable-next-line import/no-extraneous-dependencies
import { useQueryClient } from '@tanstack/react-query';

import { countryName } from '../lib/helpers';

import SingleSelectMenu from './SingleSelectMenu';
import InputField from './InputField';
import MultiSelectMenu from './MultiSelectMenu';

export default function CountryMenu( { multiSelect, isFilter, children, defaultAccept, onChange, defaultValue, autoClose } ) {
	const queryClient = useQueryClient();
	const countriesData = queryClient.getQueryData( [ 'countries' ] );

	const sortCountries = ( countryEntries ) => {
		return Object.fromEntries(
			Object.entries( countryEntries ).sort( ( [ , a ], [ , b ] ) => a.localeCompare( b ) )
		);
	};

	if ( ! countriesData[ defaultValue ] ) {
		countriesData[ defaultValue ] = countryName( defaultValue );
		queryClient.invalidateQueries( [ 'countries' ] );
	}

	const handleSelected = ( country ) => {
		if ( onChange ) {
			onChange( country );
		}
	};

	return (
		<>
			{ countriesData && ! multiSelect
				? <SingleSelectMenu
					autoClose={ autoClose }
					items={ countriesData }
					isFilter={ isFilter }
					name="countries"
					defaultAccept={ defaultAccept }
					defaultValue={ defaultValue }
					onChange={ ( country ) => handleSelected( country ) }
				>
					{ children }
				</SingleSelectMenu>
				: ! multiSelect && <InputField defaultValue={ defaultValue } onChange={ ( country ) => handleSelected( country ) } />
			}
			{
				countriesData && multiSelect &&
				<MultiSelectMenu
					items={ countriesData }
					defaultValue={ [ defaultValue ].flat() }
					onChange={ ( country ) => handleSelected( country ) }
				/>
			}
		</>
	);
}
