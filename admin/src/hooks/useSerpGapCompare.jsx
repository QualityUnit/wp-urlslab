import useTablePanels from './useTablePanels';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function useSerpGapCompare( queryCol, slug = 'serp-gap' ) {
	const setContentGapOptions = useTablePanels( ( state ) => state.setContentGapOptions );

	const navigate = useNavigate();

	const compareUrls = useCallback( ( {
		cell,
		urlsArray,
		redirect = true,
		compare_domains = false,
		show_keyword_cluster = false,
		country = 'us',
		parse_headers = [ 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
	} ) => {
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

		setContentGapOptions( {
			query,
			urls,
			matching_urls: 5,
			max_position: 10,
			compare_domains,
			show_keyword_cluster,
			country,
			parse_headers,
			ngrams: [ 1, 2, 3, 4, 5 ],

			// data for urls preprocessing
			forceUrlsProcessing: true, // run preprocessing immediately with passed data
		} );

		if ( redirect ) {
			navigate( `/Serp/${ slug }` );
		}
	}, [ navigate, queryCol, setContentGapOptions, slug ] );

	return { compareUrls };
}
