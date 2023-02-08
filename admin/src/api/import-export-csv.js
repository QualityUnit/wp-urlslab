import { fetchData } from './fetching';

let lastPage = '';
let dataForCSV = [];
let ended = false;
export const exportCSV = async ( url, fromId, pageId, arrayDeleteFields ) => {
	console.time( 'csv' );
	const perpage = 999;
	const prevDataLength = dataForCSV.length;
        		// console.log( lastPage );

	await fetchData( `${ url }?${ fromId }=${ lastPage }&rows_per_page=${ perpage }` ).then( ( response ) => {
		dataForCSV.push( response );
		if ( response.length < perpage ) {
			ended = true;
		}
	} );
	if ( url.includes( '?' ) ) {
		await fetchData( `${ url }&${ fromId }=${ lastPage }&rows_per_page=${ perpage }` ).then( ( response ) => {
			dataForCSV.push( response );
			if ( response.length < perpage ) {
				ended = true;
			}
		} );
	}

	dataForCSV = dataForCSV.flat();

	if ( ended ) {
		console.timeEnd( 'csv' );
		return dataForCSV;
	}

	if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) {
		lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ];
		exportCSV( url, fromId, pageId );
		console.log( dataForCSV );

		// console.log( dataForCSV );

		// for ( const obj of dataForCSV ) {
		// 	for ( const field of arrayDeleteFields ) {
		// 		delete obj[ field ];
		// 	}
		// }
	}
};
