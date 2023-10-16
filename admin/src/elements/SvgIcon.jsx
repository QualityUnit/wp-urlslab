import { memo } from 'react';

function SvgIcon( {
	name,
	prefix,
	...props
} ) {
	return (
		<svg { ...props } xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<use xlinkHref={ `#${ prefix ? prefix : 'icon-' }${ name }` } />
		</svg>
	);
}

export default memo( SvgIcon );
