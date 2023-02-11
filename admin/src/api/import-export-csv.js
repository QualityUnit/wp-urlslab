import { fetchData } from './fetching';

let lastPage = '3611044523';
let dataForCSV = [];
let ended = false;

export let jsonData = { status: 'downloading', data: false };

export async function exportCSV( options ) {
	const { url, fromId, pageId, deleteFields } = options;
	const qOperator = url.includes( '?' ) ? '&' : '?';
	const perpage = 9999;
	const prevDataLength = dataForCSV.length;
	try {
		await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perpage }` ).then( ( response ) => {
			dataForCSV.push( response );
			dataForCSV = dataForCSV.flat();
			if ( response.length < perpage ) {
				ended = true;
				for ( const obj of dataForCSV ) {
					for ( const field of deleteFields ) {
						delete obj[ field ];
					}
				}
			}
		} );

		if ( ended ) {
			jsonData = { status: 'done', data: dataForCSV };
			return jsonData;
		}

		if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) {
			lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ];
			// jsonData = ;
			exportCSV( options );
		}
	} catch ( error ) {
		return false;
	}
}
