const tooltipTheme = {
	JoyTooltip: {
		defaultProps: {
			size: 'sm',
			placement: 'top',
			variant: 'solid',
			color: 'neutral',
			disableFocusListener: true, // allows us to use interactive components in tooltip like buttons, otherwise tooltip lose focus on button click and is closed after another click inside tooltip
		},
		styleOverrides: {
			root: ( { ownerState, theme } ) => ( {
				...( ownerState.color === 'neutral' && ownerState.variant === 'solid' ) && {
					backgroundColor: theme.vars.palette.common.black,
					color: theme.vars.palette.common.white,
					padding: '.5em',
				},
				...( ownerState.fitContent ) && {
					padding: 0,
					overflow: 'hidden', // apply tooltip border radius for inner content
					backgroundColor: theme.vars.palette.common.white,
				},
				...( ownerState.countryMapTooltip ) && {
					padding: theme.spacing( 1.5 ),
					color: theme.vars.palette.text.secondary,
					background: theme.vars.palette.common.white,
					boxShadow: theme.vars.shadow.md,
					minWidth: '8rem',
				},
				a: {
					'&.MuiBox-root[class]': {
						color: 'var(--urlslab-palette-white) !important',
						'&:hover': {
							color: 'var(--urlslab-palette-primary-color) !important',
						},
					},
				},
			} ),
		},
	},
};

export default tooltipTheme;
