const iconButtonTheme = {
	JoyIconButton: {
		styleOverrides: {
			root: ( { ownerState } ) => ( {

				...( ownerState.size === 'xs' && {
					'--IconButton-size': '1.7rem',
					'--Icon-fontSize': 'calc(var(--IconButton-size) / 1.6)',
					minWidth: 'var(--IconButton-size)',
					minHeight: 'var(--IconButton-size)',
				} ),

				// custom svg icons
				'& svg': {
					fill: 'var(--Icon-color)',
					margin: 'var(--Icon-margin)',
					fontSize: 'var(--Icon-fontSize, 20px)',
					width: '1em',
					height: '1em',
				},

			} ),
		},
	},
};

export default iconButtonTheme;
