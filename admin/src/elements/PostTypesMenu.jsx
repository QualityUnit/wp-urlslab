import { memo, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

function PostTypesMenu( { onChange, noLabel, description, defaultValue, listboxStyles = {} } ) {
	const queryClient = useQueryClient();
	const postTypesFromQuery = queryClient.getQueryData( [ 'postTypes' ] );

	const postTypes = useMemo( () => {
		return Object.entries( postTypesFromQuery ).map( ( [ key, val ] ) => {
			return { id: key, label: val };
		} );
	}, [ postTypesFromQuery ] );

	return (
		<div>
			<FormControl>
				{ ! noLabel && <FormLabel>{ __( 'Post Type', 'wp-urlslab' ) }</FormLabel> }
				<Autocomplete
					options={ Object.values( postTypes ) }
					value={ postTypesFromQuery[ defaultValue || '' ] }
					onChange={ ( event, val ) => onChange( val.id ) }
					disableClearable
					slotProps={ {
						listbox: {
							placement: 'bottom-start',
							sx: { ...listboxStyles },
						},
					} }
				/>
			</FormControl>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</div>
	);
}

export default memo( PostTypesMenu );
