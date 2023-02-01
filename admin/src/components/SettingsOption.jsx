
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import Switch from '../elements/Switch';

import '../assets/styles/components/datepicker/datepicker.scss';
import SortMenu from '../elements/SortMenu';

export default function SettingsOption( { option } ) {
	const { id, type, title, placeholder, value, possible_values } = option;
	const [ date, setDate ] = useState( type !== 'datetime' || new Date( value ) );
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
					<SortMenu name={ id } items={ possible_values } checkedId={ value }>
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
