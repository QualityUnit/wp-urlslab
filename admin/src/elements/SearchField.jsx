import { useState, useCallback } from 'react';
import '../assets/styles/elements/_Inputs.scss';
import '../assets/styles/elements/_SearchField.scss';

export default function SearchField( { defaultValue, autoFocus, liveUpdate, placeholder, className, onChange } ) {
	const [ val, setVal ] = useState( defaultValue || '' );

	const handleVal = useCallback( ( event ) => {
		if ( onChange && ( defaultValue !== val || ! val ) ) {
			onChange( event.target.value );
		}
	}, [ onChange, defaultValue, val ] );

	return (
		<div className={ `urlslab-searchfield urlslab-inputField has-svg ${ className ? className : '' } ${ val ? 'has-value' : '' }` }>
			<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.167 16.583A7.417 7.417 0 1 0 9.166 1.75a7.417 7.417 0 0 0 .001 14.833Zm0-1.5a5.917 5.917 0 1 1 0-11.833 5.917 5.917 0 0 1 0 11.833Z" style={ { fill: '#65676b' } } /><path d="m18.03 16.97-3.625-3.625a.75.75 0 0 0-1.061 1.06l3.625 3.625a.75.75 0 0 0 1.061-1.06Z" style={ { fill: '#65676b' } } /></svg>

			{
				liveUpdate
					? <input
						className="urlslab-searchfield-input urlslab-input input__text"
						type="search"
						defaultValue={ val }
						autoFocus={ autoFocus }
						onChange={ ( event ) => {
							setVal( event.target.value );
							handleVal( event );
						} }
						placeholder={ placeholder ? placeholder : 'Search...' }
					/>
					: <input
						className="urlslab-searchfield-input urlslab-input input__text"
						type="search"
						defaultValue={ val }
						autoFocus={ autoFocus }
						onChange={ ( event ) => {
							setVal( event.target.value );
						} }
						onBlur={ ( event ) => handleVal( event ) }
						onKeyDown={ ( event ) => {
							if ( event.key === 'Enter' || event.keyCode === 9 ) {
								event.target.blur();
							}
						} }
						placeholder={ placeholder ? placeholder : 'Search...' }
					/>
			}

		</div>
	);
}
