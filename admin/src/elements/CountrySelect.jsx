import { memo } from 'react';

import Box from '@mui/joy/Box';
import Autocomplete, { createFilterOptions } from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import AutocompleteOption from '@mui/joy/AutocompleteOption';

import { countriesListForAutocomplete } from '../api/fetchCountries';

/*
*  customized Autocomplete to select Country
*	- country code included in select options
*	- country code included in search results
*/

const Input = ( { value, onChange, inputStyles } ) => (
	<Autocomplete
		value={ value ? countriesListForAutocomplete[ value ] : null }
		options={ Object.values( countriesListForAutocomplete ) }
		onChange={ ( event, newValue ) => onChange( newValue.id ) }
		filterOptions={ createFilterOptions( {
			stringify: ( option ) => option.label + option.id,
		} ) }
		slotProps={ { listbox: { sx: { padding: 0 } } } }
		sx={ { ...inputStyles } }
		renderOption={ ( props, option, { selected } ) => (
			<AutocompleteOption
				{ ...props }
				color="neutral"
				sx={ {
					borderWidth: 0,
					paddingLeft: 0,
					paddingBottom: 0,
					paddingTop: 0,
				} }
			>
				<Box sx={ ( theme ) => ( {
					minWidth: theme.spacing( 4 ),
					fontSize: theme.vars.fontSize.xs,
					backgroundColor: selected ? theme.vars.palette.neutral.plainActiveBg : theme.vars.palette.neutral.softBg,
					color: theme.vars.palette.neutral[ 500 ],
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'stretch',
				} ) }>{ option.id }</Box>
				{ option.label }
			</AutocompleteOption>
		) }
		disableClearable
	/>
);

const CountrySelect = ( { value, className, label, onChange, inputStyles } ) => (

	<div className={ className || '' }>
		{
			label
				? <FormControl>
					<FormLabel sx={ ( theme ) => ( { fontSize: theme.fontSize.labelSize } ) }>{ label }</FormLabel>
					<Input value={ value } onChange={ onChange } inputStyles={ inputStyles } />
				</FormControl>
				: <Input value={ value } onChange={ onChange } inputStyles={ inputStyles } />

		}
	</div>
);

export default memo( CountrySelect );
