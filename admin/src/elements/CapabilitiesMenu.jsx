import { memo, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

const Input = ( { defaultValue, onChange, inputStyles } ) => {
	const queryClient = useQueryClient();
	const capabilitiesFromQuery = queryClient.getQueryData( [ 'capabilities' ] );

	const capabilities = useMemo( () => {
		let caps = [ { label: 'Select None', id: 'none' }, { label: 'Select All', id: 'all' } ];
		caps = [ ...caps, ...Object.values( capabilitiesFromQuery ) ];
		return caps;
	}, [ capabilitiesFromQuery ] );

	const [ selectedVals, setVals ] = useState( ( defaultValue?.length && capabilities.filter( ( cap ) => defaultValue.includes( cap.id ) ) ) || [ ] );

	const handleOnChange = useCallback( ( event, arr ) => {
		if ( event.target.dataset.id === 'none' ) {
			setVals( [] );
			onChange( [] );
			return false;
		}

		if ( event.target.dataset.id === 'all' ) {
			setVals( Object.values( capabilitiesFromQuery ) );
			onChange( Object.values( capabilitiesFromQuery )?.map( ( val ) => val.id ) );
			return false;
		}

		setVals( arr );
		onChange( arr?.map( ( val ) => val.id ) );
	}, [ onChange, capabilitiesFromQuery ] );

	return <Autocomplete
		multiple
		id="capabilities"
		options={ capabilities }
		disableCloseOnSelect
		filterSelectedOptions
		limitTags={ 2 }
		value={ selectedVals }
		onChange={ ( event, val, reason ) => handleOnChange( event, val, reason ) }
		getOptionLabel={ ( option ) => option.label }
		slotProps={ { listbox: { sx: { padding: 0 } } } }
		sx={ { ...inputStyles } }
		renderOption={ ( props, option ) => {
			return option &&
			<li { ...props } data-id={ option.id } className="pl-m pr-m" style={ { cursor: 'pointer' } }>
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
