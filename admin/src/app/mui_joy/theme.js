import { extendTheme } from '@mui/joy/styles';

export const urlslabTheme = extendTheme( {
	cssVarPrefix: 'urlslab',
	fontFamily: {
		display: 'Poppins, var(--urlslab-fontFamily-fallback)',
		body: 'Poppins, var(--urlslab-fontFamily-fallback)',
	},
	fontSize: {
		xxs: '0.60rem',
	},
	colorSchemes: {
		light: {
			palette: {
				primary: {
					solidDisabledColor: 'var(--urlslab-palette-primary-solidColor)',
					softDisabledColor: 'var(--urlslab-palette-primary-solidColor)',
				},
				warning: {
					solidDisabledColor: 'var(--urlslab-palette-warning-solidColor)',
					softDisabledColor: 'var(--urlslab-palette-warning-solidColor)',
				},
			},
		},
	},
	components: {
		JoyTextarea: {
			styleOverrides: {
				textarea: {
					':focus, :disabled, .disabled': {
						boxShadow: 'none', // override default wp focus
					},
				},
			},
		},
		JoyCheckbox: {
			styleOverrides: {
				root: {
					wordBreak: 'break-word', // handle break of long urls that are as checkbox labels
				},
			},
		},
		JoySheet: {
			defaultProps: {
				variant: 'outlined',
			},
			styleOverrides: {
				root: ( { theme } ) => ( {
					borderRadius: 'var(--urlslab-radius-sm)',
					padding: theme.spacing( 1 ),
				} ),
			},
		},
		JoyDivider: {
			defaultProps: {
				component: 'div',
			},
		},
		JoyListItem: {
			styleOverrides: {
				root: {
					marginBottom: 0, // overrides wp default, spacing in list is managed by mui gap
				},
			},
		},
		JoyTabs: {
			defaultProps: {
				component: 'div',
			},
			styleOverrides: {
				root: {
					backgroundColor: 'transparent',
				},
			},
		},
		JoyTab: {
			defaultProps: {
				component: 'div',
			},
		},
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
				root: ( { ownerState, theme } ) => {
					let styles = {};

					// fix terrible styling of wp and third party plugins that override hover, focus and active colors of solid button that behave as 'a' tag
					if ( ownerState.component === 'a' ) {
						styles = { ...addDefaultWpButtonOverrides( { ownerState, theme } ) };
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
						...( ownerState.size === 'xs' && {
							'--Icon-fontSize': theme.vars.fontSize.md,
							'--Button-gap': '0.25rem',
							minHeight: 'var(--Button-minHeight, 1.75rem)',
							fontSize: theme.vars.fontSize.xs,
							paddingBlock: '2px',
							paddingInline: '0.5rem',
						} ),
						...( ownerState.size === 'xxs' && {
							'--Icon-fontSize': theme.vars.fontSize.sm,
							'--Button-gap': '0.25rem',
							'--Button-minHeight': '1.5rem',
							minHeight: 'var(--Button-minHeight, 1.75rem)',
							fontSize: theme.vars.fontSize.xxs,
							fontWeight: theme.vars.fontWeight.md,
							paddingBlock: '2px',
							paddingInline: '0.5rem',
						} ),

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

const addDefaultWpButtonOverrides = ( { ownerState, theme } ) => {
	const defaultPaletteColors = [ 'primary', 'neutral', 'danger', 'success', 'warning' ];
	let color = null;
	defaultPaletteColors.every( ( paletteColor ) => {
		if ( ownerState.color === paletteColor ) {
			color = theme.vars.palette[ paletteColor ][ `${ ownerState.variant }Color` ];
			return false;
		}
		return true;
	} );

	if ( color ) {
		return {
			'&:hover, &:focus, &:hover:active, &:active': { color },
		};
	}

	return null;
};
