import { fetchData } from './fetching';

let lastPage = '';
let dataForCSV = [];
let ended = false;
// Calculates status of download. Needs secondary value, ie select MAX to get max id
function* status( lastPageId ) {
	yield lastPageId;
}
export let jsonData = { status: 'loading', data: [] };

export async function exportCSV( options ) {
	const { url, fromId, pageId, perPage = 9999, deleteCSVCols } = options;
	const qOperator = url.includes( '?' ) ? '&' : '?';
	const prevDataLength = dataForCSV.length;
	const response = await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perPage }` );

	dataForCSV.push( await response );
	dataForCSV = dataForCSV.flat();
	if ( await response.length < perPage ) {
		ended = true;
		if ( deleteCSVCols?.length ) {
			for ( const obj of dataForCSV ) {
				for ( const field of deleteCSVCols ) {
					delete obj[ field ];
				}
			}
		}
	}

	if ( ended ) {
		jsonData = { status: 'done', data: dataForCSV };
		return jsonData;
	}

	if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) {
		lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ];
		status( lastPage );
		await exportCSV( options );
	}

	return jsonData;
}
