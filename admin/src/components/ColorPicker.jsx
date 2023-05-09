import { useState, useMemo, useCallback, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { HexColorPicker } from 'react-colorful';

import useClickOutside from '../hooks/useClickOutside';

import Button from '../elements/Button';
import InputField from '../elements/InputField';

import '../assets/styles/components/_ColorPicker.scss';
import '../assets/styles/components/_FloatingPanel.scss';
import '../assets/styles/elements/_Inputs.scss';

export default function ColorPicker( { defaultValue, label, className, onChange } ) {
	const { __ } = useI18n();
	const defaultColors = [ '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E' ];
	const startColor = defaultValue || defaultColors[ 0 ];

	const [ color, setColor ] = useState( startColor );
	const panelPopover = useRef();
	const [ isActive, setActive ] = useState( false );

	const close = useCallback( () => {
		setColor( startColor ); setActive( false );
	}, [] );
	useClickOutside( panelPopover, close );

	const handleColor = ( val ) => {
		setColor( val );
	};

	const handleSave = () => {
		setActive( false );
		onChange( color );
	};

	return (
		<div className={ `urlslab-colorPicker ${ className || '' }` }>
			{ label
				? <span className="urlslab-inputField-label">{ label }</span>
				: null
			}
			<button className="urlslab-colorPicker-activator" onClick={ () => setActive( true ) }>
				<div className="urlslab-colorPicker-swatch mr-m" style={ { backgroundColor: color } } />
				{ color }
			</button>
			{
				isActive &&
				<div className="urlslab-colorPicker-panel urslab-floating-panel urlslab-panel fadeInto onBottom" ref={ panelPopover }>
					<HexColorPicker color={ color } onChange={ handleColor } />
					<InputField className="mt-m mb-m" liveUpdate key={ color } autoFocus defaultValue={ color } onChange={ handleColor } />

					<span className="fs-s c-grey-darker">{ __( 'Predefined colors:' ) }</span>
					<div className="urlslab-colorPicker-swatches">
						{ defaultColors.map( ( colorVal ) => (
							<button
								key={ colorVal }
								className={ `urlslab-colorPicker-swatch__btn ${ colorVal === color ? 'active' : '' }` }
								onClick={ () => handleColor( colorVal ) }
							>
								<div className="urlslab-colorPicker-swatch" style={ { background: colorVal } } />
							</button>
						) ) }
					</div>

					<div className="Buttons mt-m flex flex-align-center">
						<Button className="ma-left simple wide" onClick={ () => {
							setColor( startColor ); setActive( false );
						} }>{ __( 'Cancel' ) }</Button>
						<Button active className="wide" onClick={ handleSave }>{ __( 'Apply' ) }</Button>
					</div>
				</div>
			}
		</div>
	);
}
