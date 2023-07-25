// eslint-disable-next-line import/no-extraneous-dependencies
import SingleSelectMenu from './SingleSelectMenu';
import InputField from './InputField';
import MultiSelectMenu from './MultiSelectMenu';
import {countriesList} from "../lib/helpers";

export default function CountryMenu( { multiSelect, isFilter, children, defaultAccept, onChange, defaultValue, autoClose } ) {
		const handleSelected = ( country ) => {
			if ( onChange ) {
				onChange( country );
			}
		};

	return (
		<>
			{ ! multiSelect
				? <SingleSelectMenu
					autoClose={ autoClose }
					items={ countriesList }
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
				multiSelect &&
				<MultiSelectMenu
					items={ countriesList }
					defaultValue={ [ defaultValue ].flat() }
					onChange={ ( country ) => handleSelected( country ) }
				/>
			}
		</>
	);
}
