import { useState } from 'react';
import '../assets/styles/elements/_Switch.scss';

export default function Switch( { id, textAfter, className, style, secondary, onChange, group, checked, label, labelOff } ) {
	const [ isChecked, setChecked ] = useState( checked ? true : false );
	const handleOnChange = ( event ) => {
		if ( onChange ) {
			onChange( event.target.checked );
		}
		setChecked( event.target.checked );
	};

	return (
		<label className={ `urlslab-switch ${ className || '' } ${ secondary ? 'secondary' : '' } ${ textAfter ? 'textAfter' : '' }` }
			style={ { style } }>
			<input
				className="urlslab-switch-input"
				type="checkbox" id={ id }
				name={ group }
				defaultChecked={ isChecked }
				onChange={ ( event ) => handleOnChange( event ) }
			/>
			<div className="urlslab-switch-switcher"></div>
			<span className="urlslab-switch-text">
				{ ! isChecked
					? label
					: labelOff ? labelOff : label
				}
			</span>
		</label>
	);
}
