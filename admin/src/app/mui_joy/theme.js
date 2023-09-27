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
				hoverRow: true,
			},
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					// main table component for modules
					...( ownerState.urlslabTable === true && {
						// the number is the amount of possible rows, we have 1 header for now...
						'--TableHeader-height': 'var(--TableCell-height)',
						'--TableRow-backgroundColor': 'var(--TableCell-headBackground)',
						'--TableRow-hoverBackground': 'rgba(0 0 0 / 0.06)',
						'--TableRow-highlightColor': 'rgba(var(--urlslab-palette-primary-mainChannel) / 0.1)',
						'--TableCell-paddingX': '0.5rem',

						// relative position and z-index for table solve problem with sticky thead covering dropdowns opened above table
						position: 'relative',
						zIndex: 1,
						lineHeight: theme.vars.fontSize.xs,

						thead: {
							position: 'sticky',
							top: '0px',
							zIndex: theme.vars.zIndex.table,

							th: {
								fontSize: theme.vars.fontSize.xs,
								position: 'relative',
								overflow: 'visible',
								verticalAlign: 'middle',
								padding: 'calc(var(--TableCell-paddingY) * 2 ) var(--TableCell-paddingX)',
								borderTopWidth: '1px',
								borderTopStyle: 'solid',

							},
						},

						tbody: {
							tr: {

								td: {
									position: 'relative',
									lineHeight: theme.vars.fontSize.md,

									'&.editRow > .limit': {
										overflow: 'visible',
										display: 'flex',
										justifyContent: 'flex-end',
										height: '100%',
									},

									'&.highlight': {
										'--TableCell-dataBackground': 'var(--TableRow-highlightColor)',
									},
								},

								'&.selected': {
									backgroundColor: 'var(--TableRow-highlightColor)',
									'td.editRow > .limit': {
										backgroundColor: 'var(--TableRow-highlightColor) !important', // override selector with color for odd rows
									},
								},

								// apply hover color on inner edit row content
								'&:hover > td.editRow > .limit': {
									backgroundColor: 'var(--TableRow-hoverBackground)',
								},
							},
						},

						// edit row with action buttons
						'tr > .editRow:last-child': {
							position: 'sticky',
							padding: 0,
							right: 0,
							width: 'var(--Table-editRowColumnWidth)',
							// edit rows have solid table background color by default because they are floating over other cells
							// decoration colors of odd cells or selected rows are applied on inner edit row content because decoration colors have transparency
							backgroundColor: 'var(--TableRow-backgroundColor)',

							borderLeft: '1px solid var(--TableCell-borderColor)',
							overflow: 'hidden',
							// define z-index because of custom components, also decrease by 1 to not overflow over sticky header, header uses default value "--urlslab-zIndex-table"
							zIndex: 'calc(var(--urlslab-zIndex-table) - 1)',
							transition: 'all 0.25s',

							'&.closed': {
								borderLeft: 0,
							},
							'.action-buttons-wrapper': {
								paddingY: '0 var(--TableCell-paddingX)',
								paddingLeft: 'var(--TableCell-paddingX)',
								paddingRight: 'var(--TableCellLast-paddingRight)',
							},
						},
						'tr td:first-child, th:first-child': {
							paddingLeft: 'var(--TableCellFirst-paddingLeft)',
						},
						'tr td:last-child, th:last-child': {
							paddingRight: 'var(--TableCellLast-paddingRight)',
						},

						// edit row in table header
						'tr > th.editRow': {
							'&.closed': {
								overflow: 'visible',
								'.action-buttons-wrapper': {
									transform: 'translateX(-100%)',
									backgroundColor: 'var(--TableCell-headBackground)',
									padding: 'calc(var(--TableCell-paddingY) * 2 ) var(--TableCell-paddingX)',
									width: 'calc( ( var(--Table-editRowClosedColumnWidth) ) + ( 2 * var(--TableCell-paddingX) ) )',
									borderLeft: '1px solid var(--TableCell-borderColor)',
									overflow: 'hidden',
									transition: 'transform 0.25s ease 0.5s, width 0.25s ease 0.5s',
								},
							},
						},

						// shortened cell text content
						//'td:not(.nolimit) > .limit, th:not(.nolimit) > .limit, td .ellipsis': {
						'& *:not(.nolimit) > .limit, td .ellipsis': {
							display: 'block',
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
						},

						// components inside table
						'tr:not(.urlslab-rowInserter) .urlslab-MultiSelectMenu .urlslab-MultiSelectMenu__title': {
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
						'.urlslab-MultiSelectMenu': {
							maxWidth: 'none',
							fontSize: '1em',
						},
						'.urlslab-inputField': {
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

						'.urlslab-input, & .urlslab-textarea': {
							textOverflow: 'ellipsis',
							width: '100%',
							backgroundColor: 'transparent',
							fontSize: '1em',

							'&:focus': {
								backgroundColor: '#ffffff',
							},
						},

						'th .urlslab-inputField-datetime': {
							'.react-datepicker__input-container, input': {
								border: 'none',
								paddingLeft: 0,
								paddingRight: 0,
								backgroundColor: 'transparent',
								fontSize: '0.75rem',
							},
						},

					} ),
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
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.urlslabTableContainer === true && {
						// table variables needed to calculate background scrolling shadows
						'--Table-editRowColumnWidth': '0px', // calculated automatically from already available buttons
						'--Table-editRowClosedColumnWidth': '0px', // calculated automatically from size of toggle button
						'--TableCell-height': '3.5em',
						// inner table padding, used size from app header parts
						'--TableCellFirst-paddingLeft': theme.spacing( 2.5 ),
						'--TableCellLast-paddingRight': theme.spacing( 2.5 ),
						overflow: 'auto',
						/*
						background: `linear-gradient(to right, ${ theme.vars.palette.background.surface } 30%, rgba(255, 255, 255, 0)),
						linear-gradient(to right, rgba(255, 255, 255, 0), ${ theme.vars.palette.background.surface } 70%) 0 100%,
						radial-gradient(farthest-side at 0 50%, rgba(255, 0, 0, 0.12), rgba(0, 0, 0, 0) ),
						radial-gradient(farthest-side at 100% 50%, rgba(0, 255, 0, 0.12), rgba(0, 0, 0, 0) ) 0 100%`,
						*/
						background: `linear-gradient(to right, ${ theme.vars.palette.background.surface } 30%, rgba(255, 255, 255, 0)),
						linear-gradient(to right, rgba(255, 255, 255, 0), ${ theme.vars.palette.background.surface } 70%) 0 100%,
						linear-gradient(to right, rgba(165, 165, 165, 0.1) 0, rgba(165, 165, 165, 0) 100%),
						linear-gradient(to left, rgba(165, 165, 165, 0.1) 0, rgba(165, 165, 165, 0) 100%) 0 100%`,
						backgroundSize: '40px 100%, 40px 100%, 16px 100%, 16px 100%',
						backgroundRepeat: 'no-repeat',
						backgroundAttachment: 'local, local, scroll, scroll',
						backgroundPosition: '0 0, calc(100% - var(--Table-editRowColumnWidth)) 0, 0 0, calc(100% - var(--Table-editRowColumnWidth) - var(--Table-ScrollbarWidth, 0px) ) 0',
						backgroundColor: theme.vars.palette.background.surface,
						transition: 'background-position 0.25s',

						'.progressbar-wrapper': {
							position: 'sticky',
							left: 0,
						},
					} ),
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
				variant: 'solid',
				color: 'neutral',
			},
			styleOverrides: {
				root: ( { ownerState, theme } ) => ( {
					...( ownerState.color === 'neutral' && ownerState.variant === 'solid' ) && {
						backgroundColor: theme.vars.palette.common.black,
						color: theme.vars.palette.common.white,

					},
				} ),
			},
		},
		JoyIconButton: {
			styleOverrides: {
				root: ( { ownerState } ) => ( {

					...( ownerState.size === 'xs' && {
						'--IconButton-size': '1.7rem',
						'--Icon-fontSize': 'calc(var(--IconButton-size) / 1.6)',
						minWidth: 'var(--IconButton-size)',
						minHeight: 'var(--IconButton-size)',
					} ),

					// custom svg icons
					'& svg': {
						fill: 'var(--Icon-color)',
						margin: 'var(--Icon-margin)',
						fontSize: 'var(--Icon-fontSize, 20px)',
						width: '1em',
						height: '1em',
					},

				} ),
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
				root: ( { ownerState, theme } ) => ( {

					// fix terrible styling of wp and third party plugins that override hover, focus and active colors of solid button that behave as 'a' tag
					...( ownerState.component === 'a' && { ...addDefaultWpButtonOverrides( { ownerState, theme } ) } ),

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

				} ),
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
