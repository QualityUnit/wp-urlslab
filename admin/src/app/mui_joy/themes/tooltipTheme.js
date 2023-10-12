const tooltipTheme = {
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
};

export default tooltipTheme;
