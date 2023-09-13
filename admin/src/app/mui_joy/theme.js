import { extendTheme } from '@mui/joy/styles';

export const urlslabTheme = extendTheme( {
	cssVarPrefix: 'urlslab',
	fontFamily: {
		display: 'Poppins, sans-serif, var(--urlslab-fontFamily-fallback)',
		body: 'Poppins, sans-serif, var(--urlslab-fontFamily-fallback)',
	},
	fontSize: {
		xxs: '0.60rem',
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
			},
		},
	},
	components: {
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
		JoyTable: {
			defaultProps: {
				size: 'sm',
			},
			styleOverrides: {
				root: ( { ownerState, theme } ) => {
					if ( ownerState.mainTable ) {
						return {
							'--TableCell-paddingX': '0.5rem',
							'--TableRow-stripeBackground': 'rgba(0 0 0 / 0.02)',
							'--TableRow-stripeBackgroundSolid': '#f6f7f8',
							'--TableRow-backgroundColor': 'var(--TableCell-headBackground)',
							// relative position and z-index for table solve problem with sticky thead covering dropdowns from main header
							position: 'relative',
							zIndex: 1,

							'& thead': {
								position: 'sticky',
								top: '0px',
								zIndex: theme.vars.zIndex.table,

								'& th': {
									fontSize: theme.vars.fontSize.xs,
									position: 'relative',
									overflow: 'visible',
									verticalAlign: 'middle',
									padding: 'calc(var(--TableCell-paddingY) * 2 ) var(--TableCell-paddingX)',
								},
							},

							'& tr': {
								lineHeight: theme.vars.fontSize.xs,

								'& td': {
									position: 'relative',
									lineHeight: theme.vars.fontSize.md,

									'&.editRow .limit': {
										overflow: 'visible',
									},

									'&.highlight': {
										'--TableCell-dataBackground': theme.palette.primary[ 50 ],
									},
								},
							},

							// edit row with action buttons
							'& tr > td:last-child, & tr > th:last-child': {
								position: 'sticky',
								right: 0,
								backgroundColor: 'var(--TableRow-backgroundColor)',
								borderLeft: '1px solid var(--TableCell-borderColor)',
							},

							'& tr:nth-of-type(2n+1) td.editRow': {
								backgroundColor: 'var(--TableRow-stripeBackgroundSolid)',
							},

							'*:not(.nolimit) .cell-wrapper > .limit': {
								display: 'block',
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							},

							//components inside table
							'& tr:not(.urlslab-rowInserter) .urlslab-MultiSelectMenu .urlslab-MultiSelectMenu__title': {
								backgroundColor: 'transparent',
								minWidth: 'auto',
							},
							'tr:not(.urlslab-rowInserter) th .urlslab-MultiSelectMenu .urlslab-MultiSelectMenu__title': {
								paddingLeft: 0,
								border: 'none',
								'&::after': {
									marginLeft: '1em',
								},
							},
							'& .urlslab-MultiSelectMenu': {
								maxWidth: 'none',
								fontSize: '1em',
							},
							'& .urlslab-inputField': {
								borderColor: 'transparent !important',
								fontSize: 'inherit',
								color: 'inherit',
								'&:hover': {
									borderColor: '#ced0d4 !important',
								},

								'& .urlslab-inputField-wrap': {
									position: 'relative',
									left: '-1em',
								},
							},

							'& .urlslab-input, & .urlslab-textarea': {
								textOverflow: 'ellipsis',
								width: '100%',
								backgroundColor: 'transparent',
								fontSize: '1em',

								'&:focus': {
									backgroundColor: '#ffffff',
								},
							},
						};
					}
					return null;
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
		JoyCheckbox: {
			styleOverrides: {
				root: ( { ownerState } ) => ( {
					wordBreak: 'break-word', // handle break of long urls that are as checkbox labels
					...( ownerState.ellipsis === true ? {
						overflow: 'hidden',
					} : null ),
				} ),
				label: ( { ownerState } ) => ( {
					wordBreak: 'break-word', // handle break of long urls that are as checkbox labels
					...( ownerState.ellipsis === true ? {
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						whiteSpace: 'nowrap',
					} : null ),
				} ),
			},
		},
		JoySheet: {
			defaultProps: {
				variant: 'outlined',
			},
			styleOverrides: {
				root: ( { ownerState, theme } ) => {
					if ( ownerState.mainTableContainer ) {
						return {
							'--TableCell-height': '44px',
							// the number is the amount of the header rows.
							'--TableHeader-height': 'calc(1 * var(--TableCell-height))',
							'--Table-lastColumnWidth': '175px',
							// background needs to have transparency to show the scrolling shadows
							'--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
							'--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
							overflow: 'auto',
							background: `linear-gradient(to right, ${ theme.vars.palette.background.surface } 30%, rgba(255, 255, 255, 0)),
							linear-gradient(to right, rgba(255, 255, 255, 0), ${ theme.vars.palette.background.surface } 70%) 0 100%,
							radial-gradient(
							farthest-side at 0 50%,
							rgba(0, 0, 0, 0.12),
							rgba(0, 0, 0, 0)
							),
							radial-gradient(
							farthest-side at 100% 50%,
							rgba(0, 0, 0, 0.12),
							rgba(0, 0, 0, 0)
							)
							0 100%`,
							backgroundSize: '40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))',
							backgroundRepeat: 'no-repeat',
							backgroundAttachment: 'local, local, scroll, scroll',
							backgroundPosition: '0 var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), 0 var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)  - 16px) var(--TableCell-height)',
							backgroundColor: theme.vars.palette.background.surface,
						};
					}

					return null;
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
		JoyTooltip: {
			defaultProps: {
				size: 'sm',
				placement: 'top',
				variant: 'soft',
			},
		},
		JoyIconButton: {
			styleOverrides: {
				root: ( { ownerState } ) => {
					let styles = {};

					if ( ownerState.size === 'xs' ) {
						styles = { ...styles, ...{
							'--IconButton-size': '1.7rem',
							'--Icon-fontSize': 'calc(var(--IconButton-size) / 1.6)',
							minWidth: 'var(--IconButton-size)',
							minHeight: 'var(--IconButton-size)',
						} };
					}

					// custom svg icons
					styles = {
						...styles,
						'& svg': {
							fill: 'var(--Icon-color)',
							margin: 'var(--Icon-margin)',
							fontSize: 'var(--Icon-fontSize, 20px)',
							width: '1em',
							height: '1em',
						},
					};

					return styles;
				},
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
						'&.underline': { textDecoration: 'underline' },
						...( ownerState.underline === true && { textDecoration: 'underline' } ),
						...( ownerState.textLeft === true && { justifyContent: 'left' } ),
						...( ownerState.squareCorners === true && { borderRadius: 0 } ),

						// new button variants
						...( ownerState.variant === 'text' && {
							color: theme.vars.palette.text.primary,
							backgroundColor: 'transparent',
							padding: 0,
							minHeight: theme.vars.fontSize[ ownerState.size ],
							'&:hover': {
								color: theme.vars.palette[ ownerState.color ].plainColor,
								backgroundColor: 'transparent',
							},

						} ),

						// new button sizes
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
				// styles for our custom svg icons, mui icon components already include following styling
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
