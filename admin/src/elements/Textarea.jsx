import { useState, useCallback } from 'react';
import { delay } from '../lib/helpers';

import '../assets/styles/elements/_Inputs.scss';

export default function TextArea( { defaultValue, autoFocus, placeholder, liveUpdate, className, readonly, disabled, label, description, labelInline, onChange, children, style, rows } ) {
	const [ val, setVal ] = useState( defaultValue || '' );

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
		<label className={ `urlslab-inputField-wrap ${ className || '' } ${ labelInline ? 'inline' : '' }` } style={ style }>
			{ label
				? <span className="urlslab-inputField-label">{ label }</span>
				: null
			}
			<div className={ `urlslab-inputField ${ val ? 'valid' : '' }` }>
				{ children }
				<textarea
					className="urlslab-input input__text"
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
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
		</label>
	);
}
