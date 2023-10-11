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
	fontSize: {
		xxs: '0.60rem',
	},
	zIndex: {
		table: 20, // use larger than 10 because of z-index of some custom components
		tooltip: 10000, // override wp main menu z-index 9990
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
		JoyStack: {
			styleOverrides: {
				root: ( { ownerState } ) => ( {
					...( ownerState.direction === 'column' && { width: '100%' } ),
				} ),
			},
		},
		JoySelect: {
			styleOverrides: {
				listbox: {
					zIndex: 10100, // increase z-index for select dropdown because selects in .urlslab-panel that have z-index 10000
				},
			},
		},
		JoyAutocomplete: {
			styleOverrides: {
				listbox: {
					zIndex: 10100, // increase z-index for select dropdown because selects in .urlslab-panel that have z-index 10000
				},
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
		JoyTab: {
			defaultProps: {
				component: 'div',
			},
		},

		JoyAlert: {
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

	},
} );

