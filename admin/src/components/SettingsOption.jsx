import InputField from '../elements/InputField';
import Switch from '../elements/Switch';

export default function SettingsOption( { option } ) {
	const renderOption = () => {
		const { id, type, title, placeholder, value } = option;
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
					<Switch className="option flex" label={ title } checked={ value === '1' } />
				);
			default:
				break;
		}
	};

	return (
		renderOption()
	);
}
