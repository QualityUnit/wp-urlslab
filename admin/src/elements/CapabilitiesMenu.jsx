import { memo, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

const Input = ( { defaultValue, singleSelect, onChange, inputStyles } ) => {
	const queryClient = useQueryClient();
	const capabilitiesFromQuery = queryClient.getQueryData( [ 'capabilities' ] );

	const capabilities = useMemo( () => {
		let caps = [ { label: __( 'Select None', 'urlslab' ), id: 'none' }, { label: __( 'Select All', 'urlslab' ), id: 'all' } ];
		if ( singleSelect ) {
			caps = Object.values( capabilitiesFromQuery );
			return caps;
		}
		caps = [ ...caps, ...Object.values( capabilitiesFromQuery ) ];
		return caps;
	}, [ capabilitiesFromQuery, singleSelect ] );

	const [ selectedVals, setVals ] = useState( ( defaultValue?.length && capabilities?.filter( ( cap ) => defaultValue.includes( cap.id ) ) ) || [] );

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

		if ( ! singleSelect ) {
			onChange( arr?.map( ( val ) => val.id ) );
			return;
		}
		onChange( arr.id );
	}, [ onChange, singleSelect, capabilitiesFromQuery ] );

	return <Autocomplete
		multiple={ ! singleSelect }
		id="capabilities"
		options={ capabilities }
		disableCloseOnSelect={ true }
		disableClearable={ true }
		filterSelectedOptions
		limitTags={ 2 }
		value={ singleSelect ? capabilitiesFromQuery[ defaultValue ] : selectedVals }
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
	/>;
};

const CapabilitiesMenu = ( { disabled, noLabel, singleSelect, description, defaultValue, role, className, onChange, inputStyles } ) => (

	<div className={ className || '' }>
		<FormControl disabled={ disabled }>
			{
				! noLabel && <FormLabel sx={ ( theme ) => ( { fontSize: theme.fontSize.labelSize } ) }>{ __( 'Capabilities', 'urlslab' ) }</FormLabel>
			}
			<Input defaultValue={ ! disabled ? defaultValue : [] } key={ singleSelect && defaultValue } singleSelect={ singleSelect } disabled={ disabled } role={ role } onChange={ onChange } inputStyles={ inputStyles } />
		</FormControl>
		{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
	</div>
);

export default memo( CapabilitiesMenu );
