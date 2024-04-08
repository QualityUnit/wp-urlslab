import { useState, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { delay } from '../lib/helpers';

import '../assets/styles/elements/_Inputs.scss';
import Tooltip from './Tooltip';

export default function TextArea( { defaultValue, autoFocus, placeholder, liveUpdate, className, readonly, disabled, label, title, description, required, newLineSeparator, labelInline, onChange, children, style, rows, allowResize } ) {
	const { __ } = useI18n();
	const [ val, setVal ] = useState( () => {
		if ( newLineSeparator && Array.isArray( defaultValue ) ) {
			return defaultValue.join( '\n' );
		}
		return defaultValue || '';
	} );

	const handleVal = useCallback( ( event ) => {
		if ( onChange && ( defaultValue !== val || ! val ) ) {
			onChange( event.target.value );
		}
	}, [ onChange, defaultValue, val ] );

	const handleValLive = ( event ) => {
		if ( liveUpdate ) {
			delay( () => handleVal( event ), 800 )();
		}
	};

	return (
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' } ${ val ? 'has-value' : '' }` } style={ style }>
			{ label
				? <span className={ `urlslab-inputField-label flex flex-align-center mb-xs ${ required ? 'required' : '' }` }>
					{ title && <span dangerouslySetInnerHTML={ { __html: title.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
					{ typeof label === 'string'
						? <span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
						: label
					}
					{ required && <Tooltip className="showOnHover">{ __( 'Required field', 'wp-urlslab' ) }</Tooltip> }
				</span>
				: null
			}
			<div className={ `urlslab-inputField ${ val ? 'valid' : '' }` }>
				{ children }
				<textarea
					className={ `urlslab-input input__text ${ allowResize ? 'allow-resize' : '' }` }
					defaultValue={ val }
					autoFocus={ autoFocus }
					onChange={ ( event ) => {
						setVal( event.target.value );
						handleValLive( event );
					} }
					onBlur={ ( event ) => handleVal( event ) }
					placeholder={ placeholder }
					readOnly={ readonly }
					disabled={ disabled ? 'disabled' : '' }
					rows={ rows || 3 }
				/>
			</div>
			{ description && <p className="urlslab-inputField-description" dangerouslySetInnerHTML={ { __html: description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
		</label>
	);
}
