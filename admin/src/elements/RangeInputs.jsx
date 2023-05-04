/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_RangeSlider.scss';

export default function RangeInputs( {
	min, max, onChange, unit, defaultMin, defaultMax,
} ) {
	const [ minimum, setMin ] = useState( min );
	const [ maximum, setMax ] = useState( max );

	const handleMin = ( event ) => {
		// const value = Math.min( +event.target.value, maximum - 1 );
		setMin( event.target.value );
	};

	const handleMax = ( event ) => {
		setMax( event.target.value );
	};

	useEffect( () => {
		if ( onChange ) {
			onChange( { min: minimum, max: maximum } );
		}
	}, [ minimum, maximum ] );

	return (
		<div className="urlslab-rangeslider-inputs">
			<label className="urlslab-inputField dark-text" data-unit={ unit }>
				<input className="urlslab-input" type="number" autoFocus defaultValue={ minimum || defaultMin } onChange={ ( event ) => handleMin( event ) } />
			</label>
			—
			<label className="urlslab-inputField dark-text" data-unit={ unit }>
				<input className="urlslab-input" type="number" defaultValue={ maximum || defaultMax } onChange={ ( event ) => handleMax( event ) } />
			</label>
		</div>
	);
}
