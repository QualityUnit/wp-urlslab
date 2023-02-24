onmessage = async function( message ) {
	const { url, fromId, pageId, deleteCSVCols } = message.data;
	const qOperator = url.includes( '?' ) ? '&' : '?';
	const perpage = 9999;
	const jsonData = { status: 'loading', data: [] };
	const lastPage = '';
	const dataForCSV = [];
	const ended = false;
	//Testing WP Rest API Cors
	const response = await fetch( '/wp-json/wp/v2/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	} ).then( ( r ) => {
		return r.json();
	} );

	console.log( await response );

	postMessage( jsonData );
	// Below Doesn't work because WP cant authorize CORS request (web workers are cors running)

	// async function exportCSV( options ) {
	// 	const { url, fromId, pageId, deleteCSVCols } = options;
	// 	const qOperator = url.includes( '?' ) ? '&' : '?';
	// 	const perpage = 9999;
	// 	const prevDataLength = dataForCSV.length;
	// 	const response = await fetchData( `${ url }${ qOperator }${ fromId }=${ lastPage }&rows_per_page=${ perpage }` );

	// 	dataForCSV.push( await response );
	// 	dataForCSV = dataForCSV.flat();
	// 	if ( await response.length < perpage ) {
	// 		ended = true;
	// 		if ( deleteCSVCols?.length ) {
	// 			for ( const obj of dataForCSV ) {
	// 				for ( const field of deleteCSVCols ) {
	// 					delete obj[ field ];
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if ( ended ) {
	// 		jsonData = { status: 'done', data: dataForCSV };
	// 		return jsonData;
	// 	}

	// 	if ( dataForCSV.length && ( dataForCSV.length > prevDataLength ) ) {
	// 		lastPage = dataForCSV[ dataForCSV?.length - 1 ][ pageId ];
	// 		await exportCSV( options );
	// 	}

	// 	return jsonData;
	// }
	// const options = message.data;
	// exportCSV( options ).then( ( res ) => postMessage( JSON.stringify( res ) ) );
};
