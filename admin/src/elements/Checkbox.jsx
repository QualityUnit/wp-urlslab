import { useState } from 'react';
import '../assets/styles/elements/_Checkbox.scss';

export default function Checkbox( { defaultValue, smallText, readOnly, radial, name, className, onChange, textBefore, children } ) {
	const [ isChecked, setChecked ] = useState( defaultValue );
	const handleOnChange = ( event ) => {
		if ( onChange && ! readOnly ) {
			onChange( event.target.checked );
		}
		if ( ! readOnly ) {
			setChecked( event.target.checked );
		}
	};
	return (
		<label className={ `urlslab-checkbox ${ className || '' } ${ textBefore ? 'textBefore' : '' } ${ radial ? 'radial' : '' }` }>
			<input
				className={ `urlslab-checkbox-input ${ isChecked ? 'checked' : '' }` }
				type={ name ? 'radio' : 'checkbox' }
				name={ name || '' }
				defaultChecked={ isChecked }
				onChange={ ( event ) => handleOnChange( event ) }
			/>
			<div className="urlslab-checkbox-box"></div>
			<span className={ `urlslab-checkbox-text ${ smallText ? 'fs-xm' : '' }` } dangerouslySetInnerHTML={ { __html: children } } />
		</label>
	);
}
