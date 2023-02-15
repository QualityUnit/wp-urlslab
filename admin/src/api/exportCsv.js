import { fetchData } from './fetching';

let lastPage = '';
let dataForCSV = [];
let ended = false;
export let jsonData = { status: 'loading', data: [] };

export async function exportCSV( options ) {
	const { url, fromId, pageId, deleteCSVCols } = options;
	const qOperator = url.includes( '?' ) ? '&' : '?';
	const perpage = 9999;
	const prevDataLength = dataForCSV.length;
	const response = await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perpage }` );

	dataForCSV.push( await response );
	dataForCSV = dataForCSV.flat();
	if ( await response.length < perpage ) {
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
		await exportCSV( options );
	}

	return jsonData;
}
