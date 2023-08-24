import { postFetch } from './fetching';
export default async function importCsv( { slug, dataArray, result, stopImport, globalImportData = {} } ) {
	const dataChunks = ( ) => {
		const chunkSize = 1000; // 1000 rows per fetch request
		const chunkArray = [];
		for ( let i = 0; i < dataArray.length; i += chunkSize ) { // Split imported CSV to chunks
			const chunk = dataArray.slice( i, i + chunkSize );
			chunkArray.push( chunk );
		}
		return { data: chunkArray, length: chunkArray.length };
	};

	const chunksLength = dataChunks().length;
	let chunkIndex = 0;
	let ended = false;
	result( 1 );

	const onResult = ( resultStatus ) => {
		if ( result ) {
			result( resultStatus );
		}
	};

	async function continueImport( index, returnResult, ) {
		if ( stopImport.current ) {
			return false;
		}

		const chunk = dataChunks().data[ index ];
		const response = await postFetch( slug, { ...globalImportData, rows: chunk } );
		if ( index === chunksLength - 1 ) {
			ended = true;
			returnResult( 100 );
		}
		if ( response.ok && index < chunksLength && ! ended ) {
			chunkIndex += 1;
			returnResult( chunkIndex / chunksLength * 100 );
			await continueImport( chunkIndex, returnResult );
		} else {
			const msg = await response.json();
			returnResult( msg.message );
		}
		return response;
	}

	continueImport( chunkIndex, onResult );
}
