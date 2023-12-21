// set colors for charts and their values in popup
const defaultColors = [ '#118AF7', '#9154CE', '#48C6CE', '#FFB928', '#CF589A', '#E5732F', '#43A047', '#FF7043', '#7986CB', '#FF8F00', '#5C6BC0', '#4DB6AC', '#FF5252', '#FFD600', '#607D8B' ];
export const setChartDataColors = ( chartsMapper ) => {
	const colorMapping = {};
	Object.keys( chartsMapper ).forEach( ( key, index ) => {
		const colorIndex = index % defaultColors.length;
		const color = defaultColors[ colorIndex ];
		colorMapping[ key ] = color;
	} );
	return colorMapping;
};

// correct data from api to the form needed by chart
export const chartDataFormatMetric = ( source ) => {
	const { date, getSettings } = window.wp.date;
	const dateFormat = getSettings().formats.date;
	const timeFormat = getSettings().formats.time;
	return Object.values(
		Object.entries( source ).map(
			( [ time_bucket, values ] ) => {
				//store human readable timestamp
				const time_bucket_formatted = `${ date( dateFormat, time_bucket * 1000 ) } ${ date( timeFormat, time_bucket * 1000 ) }`;
				const data = { time_bucket, time_bucket_formatted };
				for ( const v of values ) {
					data[ v.metric_type ] = v.metric_avg;
				}
				return data;
			}
		)
	);
};

// correct data from api to the form needed by chart
export const chartDataFormatMap = ( source ) => {
	return Object.entries( source ).reduce( ( result, [ country, values ] ) => {
		result[ country ] = values.reduce( ( reducedValues, item ) => {
			reducedValues[ item.metric_type ] = item.metric_avg;
			return reducedValues;
		}, {} );
		return result;
	}, {} );
};

// before passing data to chart, check which charts will be rendered according to current filters
export const reduceFilteredCharts = ( sourceData, filterKey, filters ) => {
	let filteredData = { ...sourceData };
	for ( const key in filters ) {
		const filterData = filters[ key ];
		if ( filterData.col === filterKey ) {
			if ( filterData.op === '=' ) {
				filteredData = {};
				filteredData[ filterData.val ] = sourceData[ filterData.val ];
				// return directly equal value selected in filter
				return filteredData;
			}
			if ( filterData.op === '<>' ) {
				delete filteredData[ filterData.val ];
			}
		}
	}
	return filteredData;
};
