import { extendTheme } from '@mui/joy/styles';

const paletteColors = [ 'primary', 'neutral', 'danger', 'success', 'warning' ];

export const theme = extendTheme( {
	cssVarPrefix: 'urlslab',
	fontFamily: {
		display: 'Poppins, var(--urlslab-fontFamily-fallback)',
		body: 'Poppins, var(--urlslab-fontFamily-fallback)',
	},
	components: {
		JoyTooltip: {
			defaultProps: {
				size: 'sm',
				placement: 'top',
			},
		},
		JoyIconButton: {
			styleOverrides: {
				root: {
					'& svg': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},
				},
			},
		},
		JoyButton: {
			styleOverrides: {
				root: ( { ownerState, theme: t } ) => {
					// fix terrible styling of wp and third party plugins that override hover, focus and active colors of solid button
					let styles = {};

					if ( ownerState.component === 'a' ) {
						let color = null;
						paletteColors.every( ( paletteColor ) => {
							if ( ownerState.color === paletteColor ) {
								color = t.vars.palette[ paletteColor ][ `${ ownerState.variant }Color` ];
								return false;
							}
							return true;
						} );

						if ( color ) {
							styles = {
								'&:hover, &:focus, &:hover:active, &:active': { color },
							};
						}
					}

					// other custom styles for button root
					styles = {
						...styles,
						'&.Mui-disabled:disabled': {
							cursor: 'not-allowed',
							pointerEvents: 'auto',
						},
						'&.underline': {
							textDecoration: 'underline',
						},

					};
					return styles;
				},
				//styles for custom button icons
				startDecorator: {
					'& svg': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},
				},
				endDecorator: {
					'& svg': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},
				},

			},
		},
	},
} );
