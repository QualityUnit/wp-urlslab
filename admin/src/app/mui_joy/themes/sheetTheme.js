const sheetTheme = {
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

					'.progressbar-wrapper': {
						position: 'sticky',
						left: 0,
					},

					'&:not(.has-scrollbar)': {
						backgroundSize: 0,
						'.urlslab-table': {
							borderBottom: `1px solid ${ theme.vars.palette.divider }`,
						},
					},
				} ),
			} ),
		},
	},
};

export default sheetTheme;
