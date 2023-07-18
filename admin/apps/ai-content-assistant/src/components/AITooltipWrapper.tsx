// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AITooltip } from './AITooltip.tsx';

declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState, useRef, useEffect } = wp.element;

interface AITooltipWrapperProps {
	children: React.ReactNode;
}

export const AITooltipWrapper = ( { children }: AITooltipWrapperProps ) => {
	const [ selectedText, setSelectedText ] = useState( '' );
	const [ coords, setCoords ] = useState( { x: 0, y: 0 } );
	const tooltipRef = useRef( null );

	useEffect( () => {
		// function to check if clicked on outside of tooltip
		function handleClickOutside( event: globalThis.MouseEvent ) {
			if ( tooltipRef.current && ! tooltipRef.current.contains( event.target ) ) {
				setSelectedText( '' );
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
		const selected = window.getSelection()?.toString();
		setSelectedText( selected );
		setCoords( { x: e.clientX, y: e.clientY } );
	};

	return (
		<Fragment>
			<div onMouseUp={ handleMouseUp }>
				{ children }
				{ selectedText &&
					<AITooltip selected={ selectedText } x={ coords.x } y={ coords.y } ref={ tooltipRef } />
				}
			</div>
		</Fragment>
	);
};
