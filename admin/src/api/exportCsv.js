import { postFetch } from './fetching';
import filtersArray from '../lib/filtersArray';

let lastRowId = '';
let dataForCSV = [];
let responseData = [];
let ended = false;
let totalItems = 1;

let jsonData = { status: 'loading', data: [] };

export async function exportCSV( options, result ) {
	const { slug, url, paginationId, perPage = 9999, deleteCSVCols, stopExport } = options;
	const { filters: userFilters } = url;

	if ( stopExport.current ) {
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

	const prevDataLength = dataForCSV.length;
	dataForCSV.push( ...responseData ); // Adds downloaded results to array

	if ( responseData.length < perPage ) { // Ends export
		ended = true;
		if ( deleteCSVCols?.length ) { // Clean the CSV from unwanted columns
			for ( const obj of dataForCSV ) {
				for ( const field of deleteCSVCols ) {
					delete obj[ field ];
				}
			}
		}
	}

	if ( ended ) {
		result( 100 ); // sends result 100 % to notifications
		// Start cleanup
		jsonData = { status: 'done', data: dataForCSV };
		lastRowId = '';
		dataForCSV = [];
		ended = false;
		// End cleanup
		return jsonData;
	}

	if ( totalItems && dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) { // continue fetching by pagination
		lastRowId = dataForCSV[ dataForCSV?.length - 1 ][ paginationId ]; // gets last row ID to continue
		result( `${ Math.round( dataForCSV.length / totalItems * 100 ) }` ); // sends result callback to notifications
		await exportCSV( options, result ); // recursive export if prev data are not shorter than max. perPage
	}

	return jsonData;
}
