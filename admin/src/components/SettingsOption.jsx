
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setSettings } from '../api/settings';
import { parseURL } from '../constants/helpers';
import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import Switch from '../elements/Switch';
import SortMenu from '../elements/SortMenu';

import '../assets/styles/components/datepicker/datepicker.scss';

export default function SettingsOption( { settingId, option } ) {
	const queryClient = useQueryClient();
	const { id, type, title, description, placeholder, value, possible_values } = option;
	const [ date, setDate ] = useState( type !== 'datetime' || new Date( value ) );

	const handleChange = useMutation( {
		mutationFn: ( changeValue ) => {
			return setSettings( `${ settingId }/${ id }`, {
				value: changeValue } );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ 'settings', settingId ] );
		},
	} );

	const handleDate = useMutation( {
		mutationFn: ( newDate ) => {
			return setSettings( `${ settingId }/${ id }`, {
				value: new Date( newDate ).toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ),
			} );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ 'settings', settingId ] );
		},
	} );

	const renderOption = () => {
		switch ( type ) {
			case 'text':
			case 'password':
			case 'number':
				return (
					<InputField
						type={ type }
						label={ title }
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'checkbox':
				return (
					<Switch
						className="option flex"
						label={ title }
						checked={ value === '1' || value === true }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'datetime':
				return (
					<DatePicker
						className="urlslab-input"
						selected={ date }
						dateFormat="dd. MMMM yyyy"
						timeFormat="HH:mm"
						onChange={ ( newDate ) => {
							setDate( newDate ); handleDate.mutate( newDate );
						} }
						showTimeSelect
					/>
				);
			case 'listbox':
				return (
					<SortMenu className="wide" name={ id } items={ possible_values } checkedId={ value } onChange={ ( selectedId ) => handleChange.mutate( selectedId ) }>
						{ title }
					</SortMenu>
				);
			default:
				break;
		}
	};

	return (
		<div className="urlslab-settingsPanel-option">
			{ renderOption() }
			{ <p className="urlslab-settingsPanel-option__desc" dangerouslySetInnerHTML={ { __html: parseURL( description ) } } /> }
		</div>
	);
}
