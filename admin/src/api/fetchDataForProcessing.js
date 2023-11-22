import { postFetch } from './fetching';
import { filtersArray } from '../hooks/useFilteringSorting';

let lastRowId = '';
let dataForProcessing = [];
let rowsProcessed = 0;
let responseData = [];
let totalItems = 1;

let jsonData = { progress: 0, status: 'loading', data: [] };

export async function fetchDataForProcessing( options, result ) {
	const { altSlug, altPaginationId, filters: userFilters, perPage = 5000, deleteCSVCols, deleteFiltered = false, stopFetching, fetchOptions = {} } = options;
	const slug = altSlug ? altSlug : options.slug;
	const paginationId = altPaginationId ? altPaginationId : options.paginationId;

	/* ---------------------
	 Preparing post body
	------------------------*/
	const { fetchBodyObj = {
		...fetchOptions,
		sorting: [ { col: paginationId, dir: 'ASC' } ],
		filters: lastRowId
			? [
				{
					cond: 'OR',
					filters: [
						{ cond: 'AND', filters: [ { col: paginationId, op: '>', val: lastRowId } ] },
					],
				},
				...filtersArray( userFilters ),
			]
			: [ ...filtersArray( userFilters ) ],
		rows_per_page: perPage,
	} } = options;

	if ( stopFetching.current ) {
		return false;
	}

	if ( ! lastRowId ) {
		const resp = await postFetch( `${ slug }/count`, fetchBodyObj ); // Getting all rows count so we can loop until end
		if ( resp.ok ) {
			totalItems = await resp.json();
		}
	}

	const response = await postFetch( slug, fetchBodyObj );
	responseData = await response.json() ?? [];

	const processForCSV = () => {
		// Start cleanup
		if ( deleteCSVCols?.length ) { // Clean the CSV from unwanted columns
			for ( const obj of dataForProcessing ) {
				for ( const field of deleteCSVCols ) {
					delete obj[ field ];
				}
			}
		}
		jsonData = {
			status: 'done', data: dataForProcessing, progress: `${ Math.round( rowsProcessed / totalItems * 100 ) }` };
	};

	/*-----------------
	 Ends Processing
	------------------*/
	if ( responseData.length < perPage ) {
		dataForProcessing.push( ...responseData );
		processForCSV();
		result( { status: 'done', data: dataForProcessing, progress: 100 } ); // sends result 100 % to notifications
		lastRowId = '';
		rowsProcessed = 0;
		dataForProcessing = [];

		// Ends exporting
		return jsonData;
	}

	/* -----------------
	 Continue fetching by pagination
	 --------------------*/
	if ( rowsProcessed < totalItems && responseData?.length ) {
		rowsProcessed += responseData?.length;
		dataForProcessing.push( ...responseData ); // Adds downloaded results to array
		lastRowId = dataForProcessing[ dataForProcessing.length - 1 ][ paginationId ]; // gets last row ID to continue

		result( { progress: `${ Math.round( rowsProcessed / totalItems * 100 ) }`, status: 'loading' } ); // sends result callback to notifications

		/* ----------------------------------
		Spliting CSV to parts by 250k rows maximum
		Doesn't apply for delete filtered
		(we use this whole function too)
		-------------------------------------*/
		if ( ! deleteFiltered && dataForProcessing?.length === 250000 ) {
			processForCSV();
			result( jsonData );
			dataForProcessing = [];
		}

		await fetchDataForProcessing( options, result ); // recursive processing if prev data are not shorter than max. perPage
	}

	return jsonData;
}
