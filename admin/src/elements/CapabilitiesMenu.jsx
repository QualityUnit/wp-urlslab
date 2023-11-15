import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

const Input = ( { defaultValue, onChange, inputStyles } ) => {
	const queryClient = useQueryClient();
	const array = useRef( [] );

	const capabilities = useMemo( () => {
		const capabilitiesFromQuery = queryClient.getQueryData( [ 'capabilities' ] );
		return capabilitiesFromQuery;
	}, [ queryClient ] );

	const [ selectedVals, setVals ] = useState( ( defaultValue?.length && Object.values( capabilities ).filter( ( cap ) => defaultValue.includes( cap.id ) ) ) || [ { label: 'None', id: 'none' } ] );

	const handleOnChange = useCallback( ( event, arr, reason ) => {
		console.log( arr );

		setVals( arr );

		// array.current = [ ...array.current.filter( ( val ) => val?.length ), ...arr.map( ( val ) => val.id !== 'none' && val.id ) ];
		// console.log( [ ...arr?.map( ( val ) => val.id ) ] );

		// onChange( [ ...new Set( arr.flat() ) ].filter( ( val ) => val ) );
	}, [ ] );

	return <Autocomplete
		multiple
		id="capabilities"
		options={ Object.values( capabilities ) }
		disableCloseOnSelect
		filterSelectedOptions
		limitTags={ 2 }
		value={ selectedVals }
		inputValue={ selectedVals }
		onChange={ ( event, val, reason ) => handleOnChange( event, val, reason ) }
		onInputChange={ ( event, val, reason ) => handleOnChange( event, val, reason ) }
		getOptionLabel={ ( option ) => option.label }
		slotProps={ { listbox: { sx: { padding: 0 } } } }
		sx={ { ...inputStyles } }
		renderOption={ ( props, option, { selected } ) => {
			return option && <li { ...props } className="pl-m pr-m">
				<button>
					{ option.label }
				</button>
			</li>;
		} }
	/>;
};

const CapabilitiesMenu = ( { disabled, description, defaultValue, role, className, onChange, inputStyles } ) => (

	<div className={ className || '' }>
		<FormControl disabled={ disabled }>
			<FormLabel sx={ ( theme ) => ( { fontSize: theme.fontSize.labelSize } ) }>{ __( 'Capabilities' ) }</FormLabel>
			<Input defaultValue={ ! disabled ? defaultValue : [] } disabled={ disabled } role={ role } onChange={ onChange } inputStyles={ inputStyles } />
		</FormControl>
		{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
	</div>
);

export default memo( CapabilitiesMenu );
