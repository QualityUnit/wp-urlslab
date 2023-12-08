import { useEffect, useRef, useState } from 'react';

import SvgIcon from './SvgIcon';
import '../assets/styles/elements/_Switch.scss';

export default function Switch( { id, textAfter, className, style, secondary, onChange, onClick, group, defaultValue, label, title, labelOff, remoteToggle } ) {
	const [ isChecked, setChecked ] = useState( defaultValue ? true : false );
	const initialLoad = useRef( true );
	const handleOnChange = ( event ) => {
		if ( onChange ) {
			onChange( event.target.checked );
		}
		setChecked( event.target.checked );
	};

	// manage checked state from remote function
	useEffect( () => {
		if ( ! initialLoad.current ) {
			setChecked( remoteToggle );
		}
		initialLoad.current = false;
	}, [ remoteToggle ] );

	return (
		<label className={ `urlslab-switch ${ className || '' } ${ secondary ? 'secondary' : '' } ${ textAfter ? 'textAfter' : '' }` }
			style={ { style } }>
			<input
				className="urlslab-switch-input"
				type="checkbox" id={ id }
				name={ group }
				defaultChecked={ isChecked }
				// in some situations we may need to block toggling of switcher and only process another action, ie. show some notification it cannot be switched on etc...
				onClick={ onClick
					? ( event ) => {
						event.preventDefault();
						onClick();
					}
					: undefined
				}
				onChange={ ! onClick ? ( event ) => handleOnChange( event ) : undefined }
				// add remote toggle only for appropriate switcher
				{ ...( remoteToggle ? { checked: isChecked } : null ) }
			/>
			<div className="urlslab-switch-switcher">
				<span className="urlslab-switch-switcher-button" >
					<SvgIcon name="minus" className="off" />
					<SvgIcon name="checkmark" className="on" />
				</span>
			</div>
			<span className="urlslab-switch-text">
				{ ! isChecked
					? <>
						{ title && <span dangerouslySetInnerHTML={ { __html: title.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
						{ typeof label === 'string'
							? <span dangerouslySetInnerHTML={ { __html: label.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } />
							: label }
					</>
					: <>
						{ title && <span dangerouslySetInnerHTML={ { __html: title.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> }
						{ ( labelOff && typeof labelOff === 'string' ? <span dangerouslySetInnerHTML={ { __html: labelOff.replace( /[\u00A0-\u9999<>\&]/g, ( i ) => '&#' + i.charCodeAt( 0 ) + ';' ).replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> : labelOff ) || ( label && typeof label === 'string' ? <span dangerouslySetInnerHTML={ { __html: label.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) } } /> : label ) }
					</>
				}
			</span>
		</label>
	);
}
