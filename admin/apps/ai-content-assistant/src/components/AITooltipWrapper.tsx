// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AITooltip } from './AITooltip.tsx';

declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState, useRef, useEffect, memo } = wp.element;

interface AITooltipWrapperProps {
	children: React.ReactNode;
	openPopup: ( open: boolean ) => void;
	setText: any;
}

const AITooltipWrapper = ( { children, openPopup, setText }: AITooltipWrapperProps ) => {
	console.log( 'AITooltipWrapper', setText );
	const tooltipRef = useRef( null );
	const blockContainerElement = useRef( null );
	const [ coords, setCoords ] = useState( { x: 0, y: 0 } );
	const [ selectedText, setSelectedText ] = useState( '' );

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
		const selected = window.getSelection()?.toString() || '';
		console.log( 'selected', selected );
		setSelectedText( selected );
		setText( selected );
		setCoords( { x: blockContainerElement.current.getBoundingClientRect().x, y: e.clientY } );
	};

	return (
		<Fragment>
			<div ref={ blockContainerElement } onMouseUp={ handleMouseUp }>
				{ children }
				{ selectedText &&
					<AITooltip setShowPopup={ openPopup } x={ coords.x } y={ coords.y } ref={ tooltipRef } />
				}
			</div>
		</Fragment>
	);
};

export default memo( AITooltipWrapper );
