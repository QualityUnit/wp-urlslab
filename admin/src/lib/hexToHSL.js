export default function hexToHSL( color ) {
	// Convert hex to RGB first
	let r = 0,
		g = 0,
		b = 0;
	if ( color?.length === 4 ) {
		r = '0x' + color[ 1 ] + color[ 1 ];
		g = '0x' + color[ 2 ] + color[ 2 ];
		b = '0x' + color[ 3 ] + color[ 3 ];
	} else if ( color?.length === 7 ) {
		r = '0x' + color[ 1 ] + color[ 2 ];
		g = '0x' + color[ 3 ] + color[ 4 ];
		b = '0x' + color[ 5 ] + color[ 6 ];
	}
	// Then to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	const cmin = Math.min( r, g, b );
	const cmax = Math.max( r, g, b );
	const delta = cmax - cmin;
	let h = 0,
		s = 0,
		l = 0;

	if ( delta === 0 ) {
		h = 0;
	} else if ( cmax === r ) {
		h = ( ( g - b ) / delta ) % 6;
	} else if ( cmax === g ) {
		h = ( ( b - r ) / delta ) + 2;
	} else {
		h = ( ( r - g ) / delta ) + 4;
	}

	h = Math.round( h * 60 );

	if ( h < 0 ) {
		h += 360;
	}

	l = ( cmax + cmin ) / 2;
	s = delta === 0 ? 0 : delta / ( 1 - Math.abs( ( 2 * l ) - 1 ) );
	s = +( s * 100 ).toFixed( 1 );
	l = +( l * 100 ).toFixed( 1 );

	return { hsl: 'hsl(' + h + ',' + s + '%,' + l + '%)', hue: h, saturation: s, lightness: l, h, s, l };
}
