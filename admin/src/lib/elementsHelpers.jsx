import { Box } from '@mui/joy';

export const getTooltipUrlsList = ( data ) => {
	return (
		data
			? <ul className="no-margin">
				{ data.map( ( item, i ) =>
					item
						? <li key={ `${ item }-${ i }` } className="no-margin">
							<Box component="a" href={ item } target="_blank" rel="noreferrer" sx={ ( theme ) => ( { color: theme.vars.palette.common.white } ) }>{ item }</Box>
						</li>
						: null
				) }
			</ul>
			: null
	);
};

export const getTooltipList = ( data ) => {
	return (
		data
			? <ul className="no-margin">
				{ data.map( ( item, i ) =>
					item
						? <li key={ `${ item }-${ i }` } className="no-margin">{ item }</li>
						: null
				) }
			</ul>
			: null
	);
};
