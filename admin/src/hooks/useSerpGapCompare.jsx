import useTablePanels from './useTablePanels';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function useSerpGapCompare( queryCol, slug = 'serp-gap' ) {
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const navigate = useNavigate();

	const compareUrls = useCallback( ( cell, urlsArray, redirect = true, compare_domains = false, show_keyword_cluster = false, country = 'us', parse_headers = false ) => {
		urlsArray = [ ...new Set( urlsArray ) ]; //unique values only
		urlsArray.length = Math.min( urlsArray.length, 15 ); //max 15 urls

		const query = queryCol && cell?.row?.original[ queryCol ];
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
			urls,
			matching_urls: 5,
			max_position: 10,
			compare_domains,
			show_keyword_cluster,
			country,
			parse_headers,
			processedUrls: {},
			forceUrlsProcessing: true,
		} );

		if ( redirect ) {
			navigate( `/Serp/${ slug }` );
		}
	}, [ navigate, queryCol, setFetchOptions, slug ] );

	return { compareUrls };
}
