import { useCallback, useEffect, useState, useRef } from 'react';
import { delay } from '../lib/helpers';

import '../assets/styles/elements/_MultiSelectMenu.scss';
import '../assets/styles/elements/_RangeSlider.scss';

export default function RangeSlider( {
	className, style, min, max, onChange, unit, children,
} ) {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const [ minimum, setMin ] = useState( min );
	const [ maximum, setMax ] = useState( max );
	const minValRef = useRef( null );
	const maxValRef = useRef( null );
	const range = useRef( null );
	const didMountRef = useRef( false );
	const ref = useRef( null );

	const handleClickOutside = useCallback( ( event ) => {
		if ( ! ref.current?.contains( event.target ) && isActive ) {
			setActive( false );
			setVisible( false );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( onChange && didMountRef.current && ! isActive ) {
			onChange( { min: minimum, max: maximum } );
		}
		didMountRef.current = true;
		if ( isActive && isVisible ) {
			document.addEventListener( 'click', handleClickOutside, true );
		}

		return () => {
			if ( isActive && isVisible ) {
				document.removeEventListener( 'click', handleClickOutside, true );
			}
		};
	}
	// do not add onChange dependency until we're not sure that all passed onChange functions are memoized and reference stable
	// eslint-disable-next-line react-hooks/exhaustive-deps
	, [ minimum, maximum, isActive, isVisible, handleClickOutside ] );

	// Convert to percentage
	const getPercent = useCallback(
		( value ) => Math.round( ( ( value - min ) / ( max - min ) ) * 100 ),
		[ min, max ]
	);

	const handleMenu = useCallback( () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	}, [ isActive, isVisible ] );

	const handleMin = useCallback( ( event ) => {
		const value = Math.min( +event.target.value, maximum - 1 );
		delay( () => {
			setMin( value );
			minValRef.current.value = value.toString();
		}, 200 )();
	}, [ maximum ] );

	const handleMax = useCallback( ( event ) => {
		const value = Math.max( +event.target.value, minimum - 1 );
		delay( () => {
			setMax( value );
			maxValRef.current.value = value.toString();
		}, 200 )();
	}, [ minimum ] );

	// Set width of the range to decrease from the left side
	useEffect( () => {
		if ( maxValRef.current ) {
			const minPercent = getPercent( minimum );
			const maxPercent = getPercent( +maxValRef.current.value ); // Precede with '+' to convert the value from type string to type number

			if ( range.current ) {
				range.current.style.left = `${ minPercent }%`;
				range.current.style.width = `${ maxPercent - minPercent }%`;
			}
		}
	}, [ minimum, getPercent ] );

	// Set width of the range to decrease from the right side
	useEffect( () => {
		if ( minValRef.current ) {
			const minPercent = getPercent( +minValRef.current.value );
			const maxPercent = getPercent( maximum );

			if ( range.current ) {
				range.current.style.width = `${ maxPercent - minPercent }%`;
			}
		}
	}, [ maximum, getPercent ] );

	return (
		<div className={ `urlslab-MultiSelectMenu ${ className || '' }` } style={ style } ref={ ref }>
			<div
				className={ `urlslab-MultiSelectMenu__title ${ isActive ? 'active' : '' }` }
				onClick={ handleMenu }
				onKeyUp={ ( event ) => handleMenu( event ) }
				role="button"
				tabIndex={ 0 }
			>
				{ children }
			</div>
			<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
				<div className="urlslab-MultiSelectMenu__items--inn urlslab-rangeslider">
					<div className="urlslab-rangeslider-top">
						<input
							type="range"
							min={ min }
							max={ max }
							value={ minimum }
							ref={ minValRef }
							onChange={ ( event ) => handleMin( event ) }
							className="urlslab-rangeslider-thumb urlslab-rangeslider-thumb-min"
						/>
						<input
							type="range"
							min={ min }
							max={ max }
							value={ maximum }
							ref={ maxValRef }
							onChange={ ( event ) => handleMax( event ) }
							className="urlslab-rangeslider-thumb urlslab-rangeslider-thumb-max"
						/>
						<div className="urlslab-rangeslider-slider">
							<div className="urlslab-rangeslider-track"></div>
							<div ref={ range } className="urlslab-rangeslider-range"></div>
						</div>
					</div>
					<div className="urlslab-rangeslider-inputs">
						<label className="urlslab-inputField dark-text" data-unit={ unit }>
							<input className="urlslab-input" type="number" min={ min } max={ max } ref={ minValRef } value={ minimum } onChange={ ( event ) => handleMin( event ) } />
						</label>
						—
						<label className="urlslab-inputField dark-text" data-unit={ unit }>
							<input className="urlslab-input" type="number" min={ min } max={ max } ref={ maxValRef } value={ maximum } onChange={ ( event ) => handleMax( event ) } />
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
