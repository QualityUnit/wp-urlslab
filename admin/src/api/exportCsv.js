import { fetchData } from './fetching';

let lastPage = '';
let dataForCSV = [];
let ended = false;
let totalItems = 1;

export let jsonData = { status: 'loading', data: [] };

export async function exportCSV( options, res ) {
	const { url, filters, fromId, pageId, perPage = 9999, deleteCSVCols } = options;
	const qOperator = url.includes( '?' ) ? '&' : '?';
	const prevDataLength = dataForCSV.length;
	const response = await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perPage }` );

	if ( ! lastPage ) {
		totalItems = await fetchData( `${ url }/count${ filters ? `?${ filters }` : '' }` );
	}

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
		res( '100' );
		return jsonData;
	}

	if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) {
		lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ];
		res( `${ Math.round( dataForCSV.length / totalItems * 100 ) }` );
		await exportCSV( options, res );
	}

	return jsonData;
}
