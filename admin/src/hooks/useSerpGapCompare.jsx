import useTablePanels from './useTablePanels';
import { useNavigate } from 'react-router-dom';

export default function useSerpGapCompare( queryCol ) {
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const navigate = useNavigate();

	const compareUrls = ( cell, urlsArray, redirect = true ) => {
		const query = cell?.row?.original[ queryCol ];
		let urls = {};

		urlsArray.map( ( url, index ) => {
			urls = {
				...urls,
				[ `url_${ index }` ]: url,
			};
			return false;
		} );

		setFetchOptions( {
			...useTablePanels.getState().fetchOptions,
			query,
			queryFromClick: query,
			urls,
			type: 'urls',
		} );

		if ( redirect ) {
			navigate( 'Serp/serp-gap' );
		}
	};

	return { compareUrls };
}
