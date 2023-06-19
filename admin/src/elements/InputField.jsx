import { useState, useCallback } from 'react';
import '../assets/styles/elements/_Inputs.scss';

export default function InputField( { defaultValue, isLoading, autoFocus, placeholder, message, liveUpdate, className, type, readonly, disabled, label, description, labelInline, onChange, onKeyDown, onBlur, onFocus, onKeyUp, children, style } ) {
	const [ val, setVal ] = useState( defaultValue || '' );
	const [ valid, setValid ] = useState( false );
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleVal = useCallback( ( event ) => {
		if ( onChange && ( defaultValue !== val || ! val ) ) {
			onChange( type === 'number' ? event.target.valueAsNumber : event.target.value );
		}
	}, [ onChange, type, defaultValue, val ] );

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
			<div className={ `urlslab-inputField ${ children ? 'has-svg' : '' } ${ isLoading ? 'loading' : '' }` } >
				{ children }
				{
					liveUpdate
						? <input
							className="urlslab-input input__text"
							type={ type || 'text' }
							defaultValue={ val }
							autoFocus={ autoFocus }
							onChange={ ( event ) => {
								setVal( event.target.value );
								handleVal( event );
							} }
							onBlur={ ( event ) => {
								handleVal( event ); if ( onBlur ) {
									onBlur( event );
								}
							} }
							onFocus={ onFocus && onFocus }
							onKeyUp={ onKeyUp }
							placeholder={ placeholder }
							readOnly={ readonly }
							disabled={ disabled ? 'disabled' : '' }
						/>
						: <input
							className="urlslab-input input__text"
							type={ type || 'text' }
							defaultValue={ val }
							autoFocus={ autoFocus }
							onChange={ ( event ) => {
								setVal( event.target.value );
							} }
							onFocus={ onFocus && onFocus }
							onBlur={ ( event ) => {
								handleVal( event ); if ( onBlur ) {
									onBlur( event );
								}
							} }
							onKeyDown={ ( event ) => {
								if ( event.key === 'Enter' || event.keyCode === 9 ) {
									event.target.blur();
								}
								if ( onKeyDown ) {
									onKeyDown( event );
								}
							} }
							onKeyUp={ onKeyUp }
							placeholder={ placeholder }
							readOnly={ readonly }
							disabled={ disabled ? 'disabled' : '' }
						/>
				}

			</div>
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
			{
				message?.length && valueStatus().length
					? <div className="urlslab-inputField-message">{ message }</div>
					: null
			}
		</label >
	);
}
