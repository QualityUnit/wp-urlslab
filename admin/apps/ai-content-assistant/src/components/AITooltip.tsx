// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Button } from '../elements/JSXElements.tsx';
import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import '../assets/styles/elements/_AITooltip.scss';
import { forwardRef } from '@wordpress/element';

declare const wp: any; // used any type until wordpress provide better typing

interface AITooltipProps {
	setShowPopup: ( show: boolean ) => void,
	x: number;
	y: number;
}

export const AITooltip = forwardRef<HTMLDivElement, AITooltipProps>( ( { setShowPopup, x, y }, ref ) => {
	const style = {
		left: `${ x - 60 }px`,
		top: `${ y - 40 }px`,
		position: 'fixed' as const,
		zIndex: 9999,
	};

	const handleClick = () => {
		setShowPopup( true );
	};

	return <div ref={ ref }>
		<Button className="ai-tooltip" style={ style } onClick={ handleClick }>
			<StarsIcon />
		</Button>
	</div>;
} );
