import { memo, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

const Input = ( { defaultValue, onChange, inputStyles } ) => {
	const queryClient = useQueryClient();

	const capabilities = useMemo( () => {
		const capabilitiesFromQuery = queryClient.getQueryData( [ 'capabilities' ] );
		return Object.values( capabilitiesFromQuery );
	}, [ queryClient ] );

	const [ selectedVals, setVals ] = useState( ( defaultValue?.length && capabilities.filter( ( cap ) => defaultValue.includes( cap.id ) ) ) || [ ] );

	const handleOnChange = useCallback( ( event, arr ) => {
		setVals( arr );
		onChange( arr?.map( ( val ) => val.id ) );
	}, [ onChange ] );

	return <Autocomplete
		multiple
		id="capabilities"
		options={ capabilities }
		disableCloseOnSelect
		filterSelectedOptions
		limitTags={ 2 }
		value={ selectedVals }
		onChange={ ( event, val, reason ) => handleOnChange( event, val, reason ) }
		onInputChange={ ( event, val, reason ) => handleOnChange( event, val, reason ) }
		getOptionLabel={ ( option ) => option.label }
		slotProps={ { listbox: { sx: { padding: 0 } } } }
		sx={ { ...inputStyles } }
		renderOption={ ( props, option ) => {
			return option && <li { ...props } className="pl-m pr-m" style={ { cursor: 'pointer' } }>
				{ option.label }
			</li>;
		} }
		disableClearable
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
