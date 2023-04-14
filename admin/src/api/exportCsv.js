import { fetchData } from './fetching';
import { getParamsChar } from '../lib/helpers';

let lastPage = '';
let dataForCSV = [];
let ended = false;
let totalItems = 1;

export let jsonData = { status: 'loading', data: [] };

export async function exportCSV( options, result ) {
	const { url, filters, fromId, pageId, perPage = 9999, deleteCSVCols } = options;
	const qOperator = getParamsChar(); // Changes ? to & query hash if already used
	const prevDataLength = dataForCSV.length;
	const response = await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perPage }${ 'undefined' === typeof filters ? '' : filters }` );

	if ( ! lastPage ) {
		totalItems = await fetchData( `${ url }/count${ filters ? getParamsChar() + `${ filters }` : '' }` );
	}

	dataForCSV.push( await response ); // Adds downloaded results to array
	dataForCSV = dataForCSV.flat();
	if ( await response.length < perPage ) { // Ends export
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
		lastPage = '';
		dataForCSV = [];
		ended = false;
		// End cleanup
		return jsonData;
	}

	if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) { // continue fetching by pagination
		lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ]; // gets last page ID to continue
		result( `${ Math.round( dataForCSV.length / totalItems * 100 ) }` ); // sends result callback to notifications
		await exportCSV( options, result ); // recursive export if prev data are not shorter than max. perPage
	}

	return jsonData;
}
