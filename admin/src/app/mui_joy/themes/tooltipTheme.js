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
