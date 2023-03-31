import { useState, useCallback } from 'react';
import { delay } from '../lib/helpers';
import '../assets/styles/elements/_Inputs.scss';

export default function InputField( { defaultValue, placeholder, message, liveUpdate, className, type, disabled, label, labelInline, onChange, children, style } ) {
	const [ val, setVal ] = useState( defaultValue || '' );
	const [ valid, setValid ] = useState( false );
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleVal = useCallback( ( event ) => {
		if ( onChange ) {
			onChange( type === 'number' ? event.target.valueAsNumber : event.target.value );
		}
	}, [ onChange, type ] );

	const handleValLive = ( event ) => {
		if ( liveUpdate ) {
			delay( () => handleVal( event ), 800 )();
		}
	};

	const valueStatus = () => {
		if ( val ) {
			if ( ( type === 'email' && emailRegex.test( val ) )
			) {
				return 'has-value success';
			}
			if ( ( type !== 'email' )
			) {
				return 'has-value';
			}
			return 'has-value error';
		}
		return '';
	};

	return (
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' } ${ valueStatus() }` } style={ style }>
			{ label
				? <span className="urlslab-inputField-label">{ label }</span>
				: null
			}
			<div className={ `urlslab-inputField ${ children ? 'has-svg' : '' }` } >
				{ children }
				<input
					className="urlslab-input input__text"
					type={ type || 'text' }
					defaultValue={ val }
					onChange={ ( event ) => {
						setVal( event.target.value );
						handleValLive( event );
					} }
					onBlur={ ( event ) => handleVal( event ) }
					onKeyDown={ ( event ) => {
						if ( event.key === 'Enter' || event.keyCode === 9 ) {
							event.target.blur();
						}
					} }
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
