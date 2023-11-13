import { useState } from 'react';

import SvgIcon from './SvgIcon';
import '../assets/styles/elements/_Switch.scss';

export default function Switch( { id, textAfter, className, style, secondary, onChange, group, defaultValue, label, labelOff } ) {
	const [ isChecked, setChecked ] = useState( defaultValue ? true : false );
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
			<div className="urlslab-switch-switcher">
				<span className="urlslab-switch-switcher-button" >
					<SvgIcon name="minus" className="off" />
					<SvgIcon name="checkmark" className="on" />
				</span>
			</div>
			<span className="urlslab-switch-text">
				{ ! isChecked
					? <span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
					: <span dangerouslySetInnerHTML={ { __html: labelOff.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> || <span dangerouslySetInnerHTML={ { __html: label.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
				}
			</span>
		</label>
	);
}
