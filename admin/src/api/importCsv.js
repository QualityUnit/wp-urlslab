import { setData } from './fetching';
export default async function importCsv( slug, dataArray, result ) {
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

	const onResult = ( resultStatus ) => {
		if ( result ) {
			result( resultStatus );
		}
	};

	async function continueImport( index, returnResult ) {
		const chunk = dataChunks().data[ index ];
		const response = await setData( slug, { rows: chunk } );
		if ( index === chunksLength - 1 ) {
			ended = true;
			returnResult( 100 );
		}
		if ( response.ok && index < chunksLength && ! ended ) {
			chunkIndex += 1;
			returnResult( chunkIndex / chunksLength * 100 );
			await continueImport( chunkIndex, returnResult );
		}
		return response;
	}

	continueImport( chunkIndex, onResult );
}
