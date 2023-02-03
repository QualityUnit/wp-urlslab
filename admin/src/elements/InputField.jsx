import { useState } from 'react';
import { urlRegex } from '../constants/helpers';
import '../assets/styles/elements/_Inputs.scss';

export default function InputField( { defaultValue, placeholder, message, className, type, disabled, label, labelInline, onChange, children, style } ) {
	const [ val, setVal ] = useState( defaultValue || '' );
	const [ valid, setValid ] = useState( false );
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleVal = ( event ) => {
		if ( onChange ) {
			onChange( event.target.value );
		}
	};

	const valueStatus = () => {
		if ( val ) {
			if ( ( type === 'email' && emailRegex.test( val ) ) ||
				( type === 'url' && urlRegex.test( val ) )
			) {
				return 'has-value success';
			}
			if ( ( type === undefined || type === 'text' ) ||
				( type === 'number' && ( /[0-9]/i ).test( val ) )
			) {
				return 'has-value';
			}
			return 'has-value error';
		}
		return '';
	};

	return (
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' } ${ valueStatus() }` } style={ style }>
			<span className="urlslab-inputField-label">{ label }</span>
			<div className={ `urlslab-inputField ${ children ? 'has-svg' : '' }` } >
				{ children }
				<input
					className="urlslab-input input__text"
					type={ type }
					defaultValue={ val }
					onChange={ ( event ) => setVal( event.target.value ) }
					onBlur={ handleVal }
					placeholder={ placeholder }
					disabled={ disabled ? 'disabled' : '' }
				/>
			</div>
			{
				message?.length && valueStatus().length
					? <div className="urlslab-inputField-message">{ message }</div>
					: null
			}
		</label >
	);
}
