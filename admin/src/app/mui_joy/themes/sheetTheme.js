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
