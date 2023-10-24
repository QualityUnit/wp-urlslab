const buttonTheme = {
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
					'--CircularProgress-size': '18px',
					minHeight: 'var(--Button-minHeight, 1.75rem)',
					fontSize: theme.vars.fontSize.xs,
					paddingBlock: '2px',
					paddingInline: '0.5rem',
				} ),

				...( ownerState.size === 'xxs' && {
					'--Icon-fontSize': theme.vars.fontSize.sm,
					'--Button-gap': '0.25rem',
					'--Button-minHeight': '1.5rem',
					'--CircularProgress-size': '18px',
					minHeight: 'var(--Button-minHeight, 1.75rem)',
					fontSize: theme.vars.fontSize.xxs,
					fontWeight: theme.vars.fontWeight.md,
					paddingBlock: '2px',
					paddingInline: '0.5rem',
				} ),

				// apply custom margin classes styles
				'&.ml-s': {
					marginLeft: theme.spacing( 1 ),
				},
				'&.mr-s': {
					marginRight: theme.spacing( 1 ),
				},
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
};

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

export default buttonTheme;
