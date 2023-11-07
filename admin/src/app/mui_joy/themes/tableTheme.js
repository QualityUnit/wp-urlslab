const tableTheme = {
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

								'&.selected': {
									backgroundColor: 'var(--TableRow-highlightColor)',

									'~ td': {
										backgroundColor: 'var(--TableRow-highlightColor)',
									},

									'~ td.editRow > .limit': {
										backgroundColor: 'var(--TableRow-highlightColor) !important', // override selector with color for odd rows
									},
								},
							},

							// apply hover color on inner edit row content
							'&:hover > td.editRow > .limit': {
								backgroundColor: 'var(--TableRow-hoverBackground)',
							},
						},
					},

					// footer cell with infinite scroll referer
					'tfoot.referrer-footer td': {
						padding: 0,
						height: 0,
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
						transition: `all ${ theme.transition.general.duration }`,

						'.action-buttons-wrapper': {
							paddingY: '0 var(--TableCell-paddingX)',
							paddingLeft: 'var(--TableCellLast-paddingRight)', // keep the same left padding in editRow cell as is right side whole table padding
							paddingRight: 'var(--TableCellLast-paddingRight)',
						},
					},
					'tr td:first-child, th:first-child': {
						paddingLeft: 'var(--TableCellFirst-paddingLeft)',
					},
					'tr td:last-child, th:last-child': {
						paddingRight: 'var(--TableCellLast-paddingRight)',
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
					'tr:not(.urlslab-rowInserter) .urlslab-MultiSelectMenu': {
						'.urlslab-MultiSelectMenu__title': {
							backgroundColor: 'transparent',
							minWidth: 'auto',
						},

						'&.table-hidden-input:not(:hover)': {
							'.urlslab-MultiSelectMenu__title': {
								borderColor: 'transparent',
								':after': {
									opacity: 0,
								},
							},

						},
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

					'tr .urlslab-TagsMenu-wrapper': {
						'.table-cell-tags-wrapper .MuiChip-root': {
							marginTop: 0,
							marginBottom: 0,
						},
						'.add-tags-button': {
							width: '100%',
							opacity: 0,
						},
					},
					'tr:hover .urlslab-TagsMenu-wrapper .add-tags-button': {
						opacity: 0.5,
						transition: `opacity ${ theme.transition.general.duration }`,

						':hover': {
							opacity: 1,
						},
					},

				} ),
				...( ownerState.hiddenTableFoot === true && {
					p: 0,
					height: 0,
				} ),
			} ),
		},
	},
};

export default tableTheme;
