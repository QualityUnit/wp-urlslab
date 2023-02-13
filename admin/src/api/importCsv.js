import { setData } from './fetching';
export default async function importCsv( slug, dataArray ) {
	let processed = {};
	const dataChunks = ( ) => {
		const chunkSize = 1000;
		const chunkArray = [];
		for ( let i = 0; i < dataArray.length; i += chunkSize ) {
			const chunk = dataArray.slice( i, i + chunkSize );
			chunkArray.push( chunk );
		}
		return { data: chunkArray, length: chunkArray.length };
	};

	const chunksLength = dataChunks().length;
	dataChunks().data.every( async ( chunk, chunkIndex ) => {
		const response = await setData( slug, { rows: chunk } );

		// Breaking if data has not passed
		if ( ! response.ok ) {
			return false;
		}
		processed = { atChunk: chunkIndex + 1, chunkCount: chunksLength };
		return true;
	} );
	// return await processed;
}
