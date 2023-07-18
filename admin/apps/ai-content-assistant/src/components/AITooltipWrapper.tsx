// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { AITooltip } from './AITooltip.tsx';

declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState } = wp.element;

interface AITooltipWrapperProps {
	children: React.ReactNode;
}

export const AITooltipWrapper = ( { children }: AITooltipWrapperProps ) => {
	const [ selectedText, setSelectedText ] = useState( '' );
	const [ coords, setCoords ] = useState( { x: 0, y: 0 } );

	const handleMouseUp = ( e:React.MouseEvent ) => {
		const selected = window.getSelection()?.toString();
		setSelectedText( selected );
		setCoords( { x: e.clientX, y: e.clientY } );
		console.log( selected );
	};

	return (
		<Fragment>
			<div onMouseUp={ handleMouseUp }>
				{ children }
				{ selectedText &&
					<AITooltip selected={ selectedText } x={ coords.x } y={ coords.y } />
				}
			</div>
		</Fragment>
	);
};
