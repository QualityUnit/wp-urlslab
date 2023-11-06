const tagTheme = {
	JoyChip: {
		styleOverrides: {
			root: ( { ownerState, theme } ) => ( {
				...( ownerState.isTag === true && {
					fontSize: theme.vars.fontSize.xs,
					fontWeight: theme.vars.fontWeight.lg,
					lineHeight: theme.vars.fontSize.xs,

					...( ownerState.fitText !== true && {
						paddingLeft: theme.spacing( 2 ),
						paddingRight: theme.spacing( 2 ),
					} ),

					...( ownerState.thinFont === true && {
						fontWeight: theme.vars.fontWeight.md,
					} ),

					...( ownerState.size === 'sm' && {
						fontSize: theme.vars.fontSize.xxs,
					} ),

					...( ownerState.isUppercase === true && {
						textTransform: 'uppercase',
					} ),

					...( ownerState.isOutlined === true && {
						backgroundColor: 'transparent',
						border: '1px solid currentColor',
					} ),

					...( ownerState.isTagCloud === true && {
						marginTop: theme.spacing( 0.25 ),
						marginBottom: theme.spacing( 0.25 ),
						marginRight: theme.spacing( 0.5 ),
						':last-child': {
							marginRight: 0,
						},
					} ),

					...( ownerState.isCircle === true && {
						width: '1.7em',
						height: '1.7em',
						padding: 0,
						textAlign: 'center',
						minHeight: 'unset',
						maxWidth: 'unset',
					} ),

					...( ownerState[ 'data-color' ] && {
						backgroundColor: ownerState[ 'data-color' ],

						...( ownerState.isDark === true && {
							color: theme.vars.palette.common.white,
						} ),

						...( ownerState.isOutlined === true && {
							color: ownerState[ 'data-color' ],
							backgroundColor: 'transparent',
							border: `1px solid ${ ownerState[ 'data-color' ] }`,
						} ),

						'.MuiChipDelete-root': {
							backgroundColor: ownerState[ 'data-color' ],
							...( ownerState.isDark === true && {
								'--Icon-color': theme.vars.palette.common.white,
							} ),

							':hover': {
								backgroundColor: theme.vars.palette.common.white,
								...( ownerState.isDark === true && {
									'--Icon-color': 'currentColor',
								} ),
							},
						},
					} ),

				} ),

			} ),
			action: ( { ownerState } ) => ( {
				// tag with click action
				...( ownerState.isTag === true && {
					backgroundColor: 'inherit !important',
				} ),
			} ),
			startDecorator: {
				// custom svg icons
				'& svg:not(.MuiCircularProgress-svg)': {
					fill: 'var(--Icon-color)',
					margin: 'var(--Icon-margin)',
					fontSize: 'var(--Icon-fontSize, 20px)',
					width: '1em',
					height: '1em',
				},
			},
			endDecorator: {
				// custom svg icons
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
};

export default tagTheme;
