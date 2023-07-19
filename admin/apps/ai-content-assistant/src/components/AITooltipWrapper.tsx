// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AITooltip } from './AITooltip.tsx';
import { PrefillData } from '../app/types.ts';

declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState, useRef, useEffect, memo } = wp.element;

interface AITooltipWrapperProps {
	children: React.ReactNode;
	openPopup: ( open: boolean ) => void;
	setPrefillData: ( data: PrefillData ) => void;
}

const AITooltipWrapper = ( { children, openPopup, setPrefillData }: AITooltipWrapperProps ) => {
	const tooltipRef = useRef( null );
	const blockContainerElement = useRef( null );
	const [ coords, setCoords ] = useState( { x: 0, y: 0 } );
	const [ selectedText, setSelectedText ] = useState( '' );

	const handleMouseUp = ( e: React.MouseEvent ) => {
		const selected = window.getSelection()?.toString() || '';
		setSelectedText( selected );
		setPrefillData( { inputText: selected } );
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
