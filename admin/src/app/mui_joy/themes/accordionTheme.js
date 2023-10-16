const accordionTheme = {
	JoyAccordionGroup: {
		styleOverrides: {
			root: ( { ownerState, theme } ) => ( {
				...( ownerState.isDescriptionBox && {
					...( ( ownerState.variant === 'plain' || ownerState.variant === 'outlined' ) && {
						backgroundColor: theme.palette.common.white,
					} ),
					// adds separator for main module description above table
					...( ownerState.isMainTableDescription && {
						'--Accordion-borderBottom': `1px solid ${ theme.vars.palette.divider }`,
					} ),

				} ),
			} ),
		},
	},
	JoyAccordionSummary: {
		styleOverrides: {
			button: ( { ownerState, theme } ) => ( {
				...( ownerState.isDescriptionBox && {
					fontWeight: theme.vars.fontWeight.lg,
					flexDirection: 'row-reverse',
					justifyContent: 'left',

					// adds extra padding to follow module header left paddings
					...( ownerState.isMainTableDescription && {
						paddingTop: theme.spacing( 1 ),
						paddingBottom: theme.spacing( 1 ),
						paddingLeft: theme.spacing( 3 ),
					} ),

				} ),
			} ),

		},
	},
	JoyAccordionDetails: {
		styleOverrides: {
			root: ( { ownerState, theme } ) => ( {
				...( ownerState.isDescriptionBox && {
					paddingLeft: theme.spacing( 1 ),
					paddingRight: theme.spacing( 1 ),

					// adds extra padding to follow module header left paddings
					...( ownerState.isMainTableDescription && {
						paddingLeft: theme.spacing( 1.5 ),
					} ),
				} ),
			} ),
		},
	},
};

export default accordionTheme;
