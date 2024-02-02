import { useState, useRef, useEffect } from 'react';
import '../assets/styles/elements/_Checkbox.scss';

/*
* controlled: input value controlled by parent component using 'value' prop, defaultValue is 'value'
* uncontrolled: input value handled by inner state, default value is provided 'defaultValue' prop.
*/
export default function Checkbox( { defaultValue, value, hasComponent, smallText, readOnly, radial, name, className, onChange, textBefore, children, disabled } ) {
	const [ isChecked, setChecked ] = useState( ( value || defaultValue ) ? true : false );
	const isControlledInit = useRef( true );
	const isControlled = value !== undefined;

	const handleOnChange = ( ) => {
		if ( onChange && ! readOnly ) {
			onChange( ! isChecked );
		}
		if ( ! readOnly && ! isControlled ) {
			setChecked( ( state ) => ! state );
		}
	};

	useEffect( () => {
		// update value from parent and prevent double render on input mount
		if ( isControlled && ! isControlledInit.current ) {
			setChecked( value );
		}
		isControlledInit.current = false;
	}, [ value, isControlled ] );

	return (
		<label className={ `urlslab-checkbox ${ className || '' } ${ textBefore ? 'textBefore' : '' } ${ radial ? 'radial' : '' }` }>
			<input
				className={ `urlslab-checkbox-input ${ isChecked ? 'checked' : '' }` }
				type={ name ? 'radio' : 'checkbox' }
				name={ name || '' }
				checked={ isChecked }
				defaultValue={ isControlled ? value : defaultValue }
				disabled={ disabled ? 'disabled' : '' }
				onChange={ ( event ) => handleOnChange( event ) }
			/>
			<div className="urlslab-checkbox-box"></div>
			{ ! hasComponent
				? <span className={ `urlslab-checkbox-text ${ smallText ? 'fs-xm' : '' }` } dangerouslySetInnerHTML={ { __html: children } } />
				: children
			}
		</label>
	);
}

