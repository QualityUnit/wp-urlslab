const checkboxTheme = {
	JoyCheckbox: {
		styleOverrides: {
			root: ( { ownerState } ) => ( {
				wordBreak: 'break-word', // handle break of long urls that are as checkbox labels
				...( ownerState.ellipsis === true ? {
					overflow: 'hidden',
				} : null ),
			} ),
			label: ( { ownerState } ) => ( {
				wordBreak: 'break-word', // handle break of long urls that are as checkbox labels
				...( ownerState.ellipsis === true ? {
					textOverflow: 'ellipsis',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
				} : null ),

				...( ownerState.textNoWrap === true ? {
					textWrap: 'nowrap',
				} : null ),

			} ),
		},
	},
};

export default checkboxTheme;
