import { postFetch } from './fetching';
import filtersArray from '../lib/filtersArray';

let lastRowId = '';
let dataForProcessing = [];
let responseData = [];
let ended = false;
let totalItems = 1;

let jsonData = { status: 'loading', data: [] };

export async function fetchDataForProcessing( options, result ) {
	const { altSlug, altPaginationId, url, perPage = 9999, deleteCSVCols, stopFetching } = options;
	const slug = altSlug ? altSlug : options.slug;
	const paginationId = altPaginationId ? altPaginationId : options.paginationId;
	const { filters: userFilters } = url;

	if ( stopFetching.current ) {
		return false;
	}
	const response = await postFetch( slug, {
		sorting: [ { col: paginationId, dir: 'ASC' } ],
		filters: lastRowId
			? [
				{
					cond: 'OR',
					filters: [
						{ cond: 'AND', filters: [ { col: paginationId, op: '>', val: lastRowId } ] },
					],
				},
				...filtersArray( userFilters ),
			]
			: [ ...filtersArray( userFilters ) ],
		rows_per_page: perPage,
	} );

	responseData = await response.json() ?? [];

	if ( ! lastRowId ) {
		const totalItemsRes = await postFetch( `${ slug }/count` ); // Getting all rows count so we can loop until end
		totalItems = await totalItemsRes.json();
	}

	const prevDataLength = dataForProcessing.length;
	dataForProcessing.push( ...responseData ); // Adds downloaded results to array

	if ( responseData.length < perPage ) { // Ends processing
		ended = true;
		if ( deleteCSVCols?.length ) { // Clean the CSV from unwanted columns
			for ( const obj of dataForProcessing ) {
				for ( const field of deleteCSVCols ) {
					delete obj[ field ];
				}
			}
		}
	}

	if ( ended ) {
		result( 100 ); // sends result 100 % to notifications
		// Start cleanup
		jsonData = { status: 'done', data: dataForProcessing };
		lastRowId = '';
		dataForProcessing = [];
		ended = false;
		// End cleanup
		return jsonData;
	}

	if ( totalItems && dataForProcessing.length && ( dataForProcessing.length > prevDataLength ) ) { // continue fetching by pagination
		lastRowId = dataForProcessing[ dataForProcessing?.length - 1 ][ paginationId ]; // gets last row ID to continue
		result( `${ Math.round( dataForProcessing.length / totalItems * 100 ) }` ); // sends result callback to notifications
		await fetchDataForProcessing( options, result ); // recursive processing if prev data are not shorter than max. perPage
	}

	return jsonData;
}
