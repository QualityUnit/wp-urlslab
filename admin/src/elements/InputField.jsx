import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import '../assets/styles/elements/_Inputs.scss';
import { delay } from '../lib/helpers';
import Tooltip from './Tooltip';

/*
* controlled: input value controlled by parent component using 'value' prop, defaultValue is 'value'
* uncontrolled: input value handled by inner state, default value is provided 'defaultValue' prop.
*/
function InputField( { defaultValue, value, isLoading, autoFocus, placeholder, message, liveUpdate, className, type, min, max, readonly, disabled, label, title, description, labelInline, onChange, onKeyDown, onBlur, onFocus, onKeyUp, children, required, style } ) {
	const { __ } = useI18n();
	const isControlledInit = useRef( true );
	const isControlled = value !== undefined;
	// eslint-disable-next-line no-nested-ternary
	const [ val, setVal ] = useState( isControlled ? value : defaultValue !== undefined ? defaultValue : '' );
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleVal = useCallback( ( event ) => {
		const newValue = type === 'number' ? event.target.valueAsNumber : event.target.value;
		if ( onChange && isControlled && value !== newValue ) {
			onChange( newValue );
		}
		if ( onChange && ! isControlled && ( defaultValue !== val || ! val ) ) {
			onChange( newValue );
		}
	}, [ defaultValue, isControlled, onChange, type, val, value ] );

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

	useEffect( () => {
		// update value from parent and prevent double render on input mount
		if ( isControlled && ! isControlledInit.current ) {
			setVal( value );
		}
		isControlledInit.current = false;
	}, [ value, isControlled ] );

	return (
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' } ${ valueStatus() }` } style={ style }>
			{ label
				? <span className={ `urlslab-inputField-label flex flex-align-center mb-xs ${ required ? 'required' : '' }` }>
					{ title && <span dangerouslySetInnerHTML={ { __html: title.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
					{ typeof label === 'string'
						? <span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
						: label }
					{ required && <Tooltip className="showOnHover">{ __( 'Required field', 'urlslab' ) }</Tooltip> }
				</span>
				: null
			}
			<div className={ `urlslab-inputField ${ children ? 'has-svg' : '' } ${ isLoading ? 'loading' : '' }` } >
				{ children }
				{
					liveUpdate
						? <input
							className="urlslab-input input__text"
							type={ type || 'text' }
							value={ val }
							defaultValue={ isControlled ? value : defaultValue }
							autoFocus={ autoFocus }
							onChange={ ( event ) => {
								setVal( event.target.value );
								handleValLive( event );
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
							min={ min }
							max={ max }
						/>
						: <input
							className="urlslab-input input__text"
							type={ type || 'text' }
							value={ val }
							defaultValue={ isControlled ? value : defaultValue }
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
							min={ min }
							max={ max }
						/>
				}
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
			{
				message?.length && valueStatus().length
					? <div className="urlslab-inputField-message">{ message }</div>
					: null
			}
		</label >
	);
}

export default memo( InputField );
