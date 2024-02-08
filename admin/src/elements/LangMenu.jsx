// eslint-disable-next-line import/no-extraneous-dependencies
import { memo } from 'react';
import { __ } from '@wordpress/i18n';

import { fetchLangsForAutocomplete } from '../api/fetchLangs';

import Autocomplete from '@mui/joy/Autocomplete';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

const langs = fetchLangsForAutocomplete();

function LangMenu( { onChange, hasTitle, description, defaultValue, listboxStyles = {} } ) {
	return (
		<div>
			<FormControl>
				{ hasTitle && <FormLabel>{ __( 'Language' ) }</FormLabel> }
				<Autocomplete
					options={ Object.values( langs ) }
					// use default value in lowercase, resolves problem in tables with not exact language codes, ie. 'zh-Hans' instead of 'zh-hans'...
					value={ langs[ ( defaultValue && defaultValue.toLowerCase() ) || '' ] }
					onChange={ ( event, val ) => onChange( val.id ) }
					disableClearable
					slotProps={ { listbox: {
						placement: 'bottom-start',
						sx: { ...listboxStyles },
					} } }
				/>
			</FormControl>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</div>
	);
}

export default memo( LangMenu );
