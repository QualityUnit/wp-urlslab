import { memo, useCallback, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Box from '@mui/joy/Box';
import Autocomplete, { createFilterOptions } from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import Checkbox from './Checkbox';

const Input = ( { defaultValue, role, onChange, inputStyles } ) => {
	const queryClient = useQueryClient();
	const roles = queryClient.getQueryData( [ 'roles' ] );
	const capabilities = roles[ role || Object.keys( roles )[ 0 ] ].capabilities;

	const capabilitiesOptions = useMemo( () => {
		return Object.keys( capabilities ).reduce( ( opts, key ) => ( { ...opts, [ key ]: { label: capabilities[ key ], id: key } } ), {} );
	}, [ capabilities ] );
	const array = useRef( [] );

	const handleOnChange = useCallback( ( arr ) => {
		array.current = [ ...array.current, ...arr.map( ( val ) => val.id ) ];
		onChange( [ ...new Set( array.current.flat() ) ] );
	}, [ ] );

	return <Autocomplete
		multiple
		id="capabilities"
		options={ Object.values( capabilitiesOptions ) }
		disableCloseOnSelect
		limitTags={ 2 }
		value={ ( defaultValue?.length && Object.values( capabilitiesOptions ).filter( ( cap ) => defaultValue.includes( cap.id ) ) ) || Object.values( capabilitiesOptions ) }
		onChange={ ( event, val ) => handleOnChange( val ) }
		getOptionLabel={ ( option ) => option.label }
		slotProps={ { listbox: { sx: { padding: 0 } } } }
		sx={ { ...inputStyles } }
		renderOption={ ( props, option, { selected } ) => (
			<li { ...props } className="pl-m pr-m">
				<Checkbox
					defaultValue={ selected }
				>
					{ option.label }
				</Checkbox>
			</li>
		) }
		disableClearable
	/>;
};

const CapabilitiesMenu = ( { defaultValue, role, className, onChange, inputStyles } ) => (

	<div className={ className || '' }>
		{
			<FormControl>
				<FormLabel sx={ ( theme ) => ( { fontSize: theme.fontSize.labelSize } ) }>{ __( 'Capabilities' ) }</FormLabel>
				<Input defaultValue={ defaultValue } role={ role } onChange={ onChange } inputStyles={ inputStyles } />
			</FormControl>

		}
	</div>
);

export default memo( CapabilitiesMenu );
