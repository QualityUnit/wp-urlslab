const accordionTheme = {
	JoyAccordionGroup: {
		styleOverrides: {
			root: ( { ownerState, theme } ) => ( {
				...( ownerState.isDescriptionBox && {
					...( ( ownerState.variant === 'plain' || ownerState.variant === 'outlined' ) && {
						backgroundColor: theme.palette.common.white,
					} ),

					'--LeftArrowWidth': theme.spacing( 2.25 ),
					'--LeftArrowSpace': `calc( var( --LeftArrowWidth ) + var( --ListItem-paddingLeft ) )`, // arrow width + gap between arrow and title
					'--ContentWrapper--paddingLeft': theme.spacing( 2 ),
					'--ContentWrapper--paddingRight': theme.spacing( 2 ),

					// adds separator for main module description above table
					...( ownerState.isMainTableDescription && {
						'--Accordion-borderBottom': `1px solid ${ theme.vars.palette.divider }`,
						'--ContentWrapper--paddingLeft': theme.spacing( 3 ),
						'--ContentWrapper--paddingRight': theme.spacing( 3 ),
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
					paddingLeft: 'var( --ContentWrapper--paddingLeft )',
					paddingRight: 'var( --ContentWrapper--paddingRight )',

					// adds extra padding to follow module header left paddings
					...( ownerState.isMainTableDescription && {
						paddingTop: theme.spacing( 1 ),
						paddingBottom: theme.spacing( 1 ),
					} ),

				} ),

				...( ownerState.leftIconIndicator && {
					flexDirection: 'row-reverse',
					justifyContent: 'left',
				} ),
			} ),
			// styles for our custom svg icons, mui icon components already include following styling
			indicator: ( { theme } ) => ( {
				'& svg:not(.MuiSvgIcon-root)': {
					fill: 'var(--Icon-color, currentcolor)',
					margin: 'var(--Icon-margin)',
					fontSize: `var(--Icon-fontSize, ${ theme.vars.fontSize.xl2 })`,
					width: '0.6em',
					height: '0.6em',
				},
			} ),
		},
	},

	JoyAccordionDetails: {
		styleOverrides: {
			root: ( { ownerState } ) => ( {
				...( ownerState.isDescriptionBox && {

					paddingLeft: 'calc( var(--ContentWrapper--paddingLeft ) + var( --LeftArrowSpace ) + var( --ListItem-paddingLeft ) / 2 )',
					paddingRight: 'var( --ContentWrapper--paddingRight )',

					'.MuiAccordionDetails-content': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				} ),
			} ),
		},
	},
};

export default accordionTheme;
