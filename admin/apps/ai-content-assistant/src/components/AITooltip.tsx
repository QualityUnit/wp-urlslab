// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

const { Fragment, useState } = wp.element;
import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';

interface AITooltipProps {
    selected: string,
    x: number;
    y: number;
}

export const AITooltip = ( { selected, x, y }: AITooltipProps ) => {
	const style = {
		left: `${ x }px`,
		top: `${ y - 40 }px`,
		position: 'fixed' as const,
		zIndex: 9999,
	};

	return <button className="ai-tooltip" style={ style }>
		<StarsIcon />
	</button>;
};
