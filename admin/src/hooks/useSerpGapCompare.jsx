import useTablePanels from './useTablePanels';
import { useNavigate } from 'react-router-dom';

export default function useSerpGapCompare( queryCol, slug = 'serp-gap' ) {
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const navigate = useNavigate();

	const compareUrls = ( cell, urlsArray, redirect = true, compare_domains = false ) => {
		const query = queryCol && cell?.row?.original[ queryCol ];
		let urls = {};

		urlsArray.map( ( url, index ) => {
			urls = {
				...urls,
				[ `url_${ index }` ]: url,
			};
			return false;
		} );

		if ( redirect ) {
			navigate( `/Serp/${ slug }` );
		}
		setFetchOptions( {
			...useTablePanels.getState().fetchOptions,
			query,
			queryFromClick: query,
			urls,
			matching_urls: 5,
			max_position: 10,
			compare_domains,
		} );
	};

	return { compareUrls };
}
