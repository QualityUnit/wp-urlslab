import { extendTheme } from '@mui/joy/styles';
import accordionTheme from './themes/accordionTheme';
import tagTheme from './themes/tagTheme';
import tableTheme from './themes/tableTheme';
import sheetTheme from './themes/sheetTheme';
import checkboxTheme from './themes/checkboxTheme';
import iconButtonTheme from './themes/iconButtonTheme';
import buttonTheme from './themes/buttonTheme';
import tooltipTheme from './themes/tooltipTheme';

export const urlslabTheme = extendTheme( {
	cssVarPrefix: 'urlslab',
	fontFamily: {
		display: 'Poppins, sans-serif, var(--urlslab-fontFamily-fallback)',
		body: 'Poppins, sans-serif, var(--urlslab-fontFamily-fallback)',
	},
	breakpoints: {
		values: {
			//default mui
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
			// custom
			xxl: 1800,
			xxxl: 2048, //~2K
		},
	},
	fontSize: {
		xxs: '0.60rem',
		labelSize: '0.8125rem',
	},
	zIndex: {
		table: 20, // use larger than 10 because of z-index of some custom components
		tooltip: 10000, // override wp main menu z-index 9990
	},
	// custom transition options
	transition: {
		general: {
			duration: '0.25s',
		},
	},
	colorSchemes: {
		light: {
			palette: {
				background: {
					body: '#edeff3',
				},
				primary: {
					solidDisabledColor: 'var(--urlslab-palette-primary-solidColor)',
					softDisabledColor: 'var(--urlslab-palette-primary-solidColor)',
				},
				warning: {
					solidDisabledColor: 'var(--urlslab-palette-warning-solidColor)',
					softDisabledColor: 'var(--urlslab-palette-warning-solidColor)',
				},
				success: {
					plainColor: 'var(--urlslab-palette-saturated-green)',
					solidBg: 'var(--urlslab-palette-saturated-green)',
				},
				urlslabColors: {
					greyDarker: '#65676B',
				},
			},
		},
	},
	components: {
		...accordionTheme,
		...tagTheme,
		...tableTheme,
		...sheetTheme,
		...checkboxTheme,
		...iconButtonTheme,
		...buttonTheme,
		...tooltipTheme,

		JoyInput: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
				} ),
				input: {
					':focus, :disabled, .disabled': {
						boxShadow: 'none', // override default wp focus
					},
				},
				// styles for our custom svg icons, mui icon components already include following styling
				startDecorator: {
					'& svg:not(.MuiCircularProgress-svg)': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},
				},
				endDecorator: {
					'& svg:not(.MuiCircularProgress-svg)': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},
				},
			},
		},
		JoyFormLabel: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					fontWeight: theme.fontWeight.lg,
					...( ownerState.flexNoWrap === true && {
						flexWrap: 'nowrap',
					} ),
					...( ownerState.textNoWrap === true && {
						textWrap: 'nowrap',
					} ),
				} ),
			},
		},
		JoyStack: {
			styleOverrides: {
				root: ( { ownerState } ) => ( {
					...( ownerState.direction === 'column' && { width: '100%' } ),
				} ),
			},
		},
		JoySelect: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
				} ),
				listbox: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
					zIndex: 10100, // increase z-index for select dropdown because selects in .urlslab-panel that have z-index 10000
				} ),
			},
		},
		JoyAutocomplete: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
				} ),
				listbox: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
					zIndex: 10100, // increase z-index for select dropdown because selects in .urlslab-panel that have z-index 10000
				} ),
			},
		},
		JoyLinearProgress: {
			styleOverrides: {
				root: {
					'::before': {
						transition: 'inline-size 1s cubic-bezier(0.7, 0, 1, 1)', // make progressbar more smooth
					},
				},
			},
		},
		JoyFormHelperText: {
			styleOverrides: {
				root: {
					flexDirection: 'column',
					alignItems: 'flex-start',
				},
			},
		},
		JoyTextarea: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'md' && {
						// smaller font size for default input
						fontSize: theme.vars.fontSize.sm,
						lineHeight: theme.vars.lineHeight.sm,
					} ),
				} ),
				textarea: {
					':focus, :disabled, .disabled': {
						boxShadow: 'none', // override default wp focus
					},
				},
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
		JoyTabList: {
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'lg' ) && {
						fontSize: theme.vars.fontSize.md,
					},
				} ),
			},
		},
		JoyTab: {
			defaultProps: {
				component: 'div',
			},
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.size === 'lg' ) && {
						fontSize: theme.vars.fontSize.md,
					},

					...( ownerState.variant === 'simple' ) && {
						backgroundColor: 'transparent',
						fontSize: theme.vars.fontSize.sm,

						'&:hover': {
							backgroundColor: 'transparent',
							color: theme.vars.palette.primary.solidHoverBg,
						},

						'&.Mui-selected': {
							color: theme.vars.palette.primary.solidBg,
						},
					},
				} ),
			},
		},
		JoyAlert: {
			styleOverrides: {
				root: {
					'& svg:not(.MuiCircularProgress-svg)': {
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

