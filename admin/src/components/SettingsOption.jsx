
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setSettings } from '../api/settings';
import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import Switch from '../elements/Switch';
import SortMenu from '../elements/SortMenu';

import '../assets/styles/components/datepicker/datepicker.scss';

export default function SettingsOption( { settingId, sectionIndex, option, optionIndex } ) {
	const queryClient = useQueryClient();
	// console.log( sectionIndex );
	const { id, type, title, placeholder, value, possible_values } = option;
	const [ date, setDate ] = useState( type !== 'datetime' || new Date( value ) );

	// queryClient.setQueryData(['settings', settingId[sectionIndex]], !isActive);
	// const testData = queryClient.getQueryData( [ 'settings', settingId ] );

	const handleInputField = useMutation( {
		mutationFn: ( changeValue ) => {
			// queryClient.setQueryData( [ 'settings', settingId ], { [ [ sectionIndex ].options[ optionIndex ].value ]: changeValue } );
			// console.log( testData[ sectionIndex ].options[ optionIndex ] );
			return setSettings( settingId, { gule: 'nic' } );
		},
		onSuccess: () => {
			queryClient.invalidateQueries( [ 'settings', settingId ] );
			console.log( queryClient.getQueryData( [ 'settings', settingId ] ) );
		},
		onError: ( error ) => {
			console.log( error );
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
						onChange={ ( inputValue ) => handleInputField.mutate( inputValue ) }
					/>
				);
			case 'checkbox':
				return (
					<Switch
						className="option flex"
						label={ title }
						onChange={ () => console.log( `${ id }:${ ! value }` ) }
						checked={ value === '1' || value === true }
					/>
				);
			case 'datetime':
				const handleDate = ( newDate ) => {
					setDate( newDate );
				};
				return (
					<DatePicker
						className="urlslab-input"
						selected={ date }
						dateFormat="dd. MMMM yyyy"
						timeFormat="HH:mm"
						locale={ window.navigator.language }
						onChange={ ( newDate ) => handleDate( newDate ) }
						showTimeSelect
					/>
				);
			case 'listbox':
				return (
					<SortMenu name={ id } items={ possible_values } checkedId={ value } onChange={ ( selectedId ) => console.log( selectedId ) }>
						{ title }
					</SortMenu>
				);
			default:
				break;
		}
	};

	return (
		renderOption()
	);
}
