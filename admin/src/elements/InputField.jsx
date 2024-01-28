import { useI18n } from '@wordpress/react-i18n';
import { useState, useRef, useCallback, memo, useEffect } from 'react';
import '../assets/styles/elements/_Inputs.scss';
import { delay } from '../lib/helpers';
import Tooltip from './Tooltip';

/*
* value & defaultValue used similar as MUI components
* value - used to control component value(state) from outside
* defaultValue - set initial value of component state, further change of defaultValue from outside doesn't affect state of component during his lifecycle
*/
function InputField( { defaultValue, value, isLoading, autoFocus, placeholder, message, liveUpdate, className, type, min, max, readonly, disabled, label, title, description, labelInline, onChange, onKeyDown, onBlur, onFocus, onKeyUp, children, required, style } ) {
	const { __ } = useI18n();
	const [ val, setVal ] = useState( defaultValue || '' );
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const handleVal = useCallback( ( event ) => {
		if ( onChange && ( defaultValue !== val || ! val ) ) {
			onChange( type === 'number' ? event.target.valueAsNumber : event.target.value );
		}
	}, [ onChange, type, defaultValue, val ] );

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
		if ( value !== undefined ) {
			setVal( value );
		}
	}, [ value ] );

	return (
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' } ${ valueStatus() }` } style={ style }>
			{ label
				? <span className={ `urlslab-inputField-label flex flex-align-center mb-xs ${ required ? 'required' : '' }` }>
					{ title && <span dangerouslySetInnerHTML={ { __html: title.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
					{ typeof label === 'string'
						? <span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
						: label }
					{ required && <Tooltip className="showOnHover">{ __( 'Required field' ) }</Tooltip> }
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
