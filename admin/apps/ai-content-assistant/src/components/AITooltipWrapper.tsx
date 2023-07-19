// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AITooltip } from './AITooltip.tsx';

declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState, useRef, useEffect } = wp.element;

interface AITooltipWrapperProps {
	children: React.ReactNode;
	openPopup: ( open: boolean ) => void;
	setInputText: ( text: string ) => void;
}

export const AITooltipWrapper = ( { children, openPopup, setInputText }: AITooltipWrapperProps ) => {
	const [ coords, setCoords ] = useState( { x: 0, y: 0 } );
	const tooltipRef = useRef( null );
	const { selectedText, setSelectedText } = useState( '' );

	useEffect( () => {
		// function to check if clicked on outside of tooltip
		function handleClickOutside( event: globalThis.MouseEvent ) {
			if ( tooltipRef.current && ! tooltipRef.current.contains( event.target ) ) {
				setInputText( '' );
			}
		}

		// add mousedown event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// cleanup the event listener on component unmount
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	}, [] );

	const handleMouseUp = ( e: React.MouseEvent ) => {
		const selected = window.getSelection()?.toString() || '';
		setInputText( selected );
		setSelectedText( selected );
		setCoords( { x: e.clientX, y: e.clientY } );
	};

	return (
		<Fragment>
			<div onMouseUp={ handleMouseUp }>
				{ children }
				{ selectedText &&
					<AITooltip setShowPopup={ openPopup } x={ coords.x } y={ coords.y } ref={ tooltipRef } />
				}
			</div>
		</Fragment>
	);
};
