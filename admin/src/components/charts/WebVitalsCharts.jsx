import { memo, useContext, useMemo, createContext } from 'react';
import { __ } from '@wordpress/i18n';
import { useQuery } from '@tanstack/react-query';

import { postFetch } from '../../api/fetching';
import useTableStore from '../../hooks/useTableStore';
import { filtersArray } from '../../hooks/useFilteringSorting';
import TableFilters from '../TableFilters';

import { getYesterdayDate } from '../../lib/helpers';
import { metric_types, metric_typesNames } from '../../tables/WebVitalsTable';
import AreaChart from '../../elements/charts/AreaChart';
import WorldMapChart from '../../elements/charts/WorldMapChart';

import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

const getLast24hrsFilters = ( cellName ) => {
	const date = getYesterdayDate();
	return [ { col: cellName, op: '>', val: date } ];
};

const useChartQuery = ( slug, data, dataHandler ) => {
	return useQuery( {
		queryKey: [ slug, data ],
		queryFn: async ( { signal } ) => {
			const response = await postFetch( slug, data, { signal } );
			if ( response.ok ) {
				const responseData = await response.json();
				if ( dataHandler ) {
					return dataHandler( responseData );
				}
				return responseData;
			}
			return null;
		},
		refetchOnWindowFocus: false,
	} );
};
// correct data from api to the form needed by chart
const groupMetricTypeByTimeBucket = ( sourceArray ) => {
	const { date, getSettings } = window.wp.date;
	const dateFormat = getSettings().formats.date;
	const timeFormat = getSettings().formats.time;
	return Object.values( sourceArray.reduce( ( result, entry ) => {
		const { metric_type, metric_count, time_bucket } = entry;
		const time_bucket_formatted = `${ date( dateFormat, time_bucket * 1000 ) } ${ date( timeFormat, time_bucket * 1000 ) }`;
		result[ time_bucket ] = result[ time_bucket ] || { time_bucket };
		result[ time_bucket ][ metric_type ] = metric_count;
		result[ time_bucket ].time_bucket_formatted = time_bucket_formatted;
		return result;
	}, {} ) );
};

// before passing data to chart, check which charts will be rendered according to current filters
const reduceFilteredMetricCharts = ( sourceData, filterKey, filters ) => {
	for ( const key in filters ) {
		const filterData = filters[ key ];
		if ( filterData.col === filterKey ) {
			if ( filterData.op === '=' ) {
				const filteredData = {};
				filteredData[ filterData.val ] = sourceData[ filterData.val ];
				return filteredData;
			}
			if ( filterData.op === '<>' ) {
				const filteredData = { ...sourceData };
				delete filteredData[ filterData.val ];
				return filteredData;
			}
		}
	}

	return sourceData;
};

// store api data by country key, so we can easily access wanted option by key
const handleCountryApiChartResponse = ( sourceArray ) => {
	return sourceArray.reduce( ( result, entry ) => {
		if ( entry.country ) {
			result[ entry.country ] = entry;
		}
		return result;
	}, {} );
};

const WebVitalsChartsContext = createContext( {} );

const WebVitalsCharts = () => {
	const activeTable = useTableStore( ( state ) => state.activeTable );
	let filters = useTableStore( ( state ) => state.tables[ activeTable ]?.filters );
	filters = filters ? filtersArray( filters ) : {};

	const hasDateFilter = useMemo( () => Object.values( filters ).filter( ( filter ) => filter.col === 'created' ).length > 0, [ filters ] );

	const queryData = useMemo( () => hasDateFilter
		? { filters }
		: { filters: [ ...getLast24hrsFilters( 'created' ), ...Object.values( filters ) ] }
	, [ filters, hasDateFilter ] );

	return (
		<WebVitalsChartsContext.Provider value={ { queryData, hasDateFilter, filters } }>
			<Stack spacing={ 2 }>
				<Box sx={ {
					zIndex: 2, // increase z-index for filters floating panel over charts
				} }>
					<TableFilters />
				</Box>
				<Stack spacing={ 4 }>
					<MetricChart />
					<CountryChart />
				</Stack>

			</Stack>
		</WebVitalsChartsContext.Provider>
	);
};

const MetricChart = memo( () => {
	const { queryData, filters } = useContext( WebVitalsChartsContext );
	const { data, isSuccess, isFetching } = useChartQuery( 'web-vitals/charts/metric-type', queryData, groupMetricTypeByTimeBucket );
	return (
		<BoxWrapper>
			<ChartTitle title={ __( 'Metric chart' ) } />

			{ isFetching && <ChartLoader /> }

			{ ( isSuccess && ! isFetching ) &&
				( data && data.length > 0
					? <AreaChart
						data={ data }
						chartsMapper={ reduceFilteredMetricCharts( metric_typesNames, 'metric_type', filters ) }
						legendTitlesMapper={ metric_types }
						xAxisKey="time_bucket_formatted"
						height={ 300 }
					/>
					: <NothingToShow />
				)

			}
		</BoxWrapper>
	);
} );

const CountryChart = memo( () => {
	const { queryData } = useContext( WebVitalsChartsContext );
	const { data, isSuccess, isFetching } = useChartQuery( 'web-vitals/charts/country', queryData, handleCountryApiChartResponse );

	return (
		<BoxWrapper>
			<ChartTitle title={ __( 'Country chart' ) } />

			{ isFetching && <ChartLoader /> }

			{ ( isSuccess && ! isFetching ) &&
				( data && data.length > 0
					? <WorldMapChart
						data={ data }
						optionsMapper={ { country_event_count: __( 'Events count' ) } }
						colorKey="country_event_count"

					/>
					: <NothingToShow />
				)

			}
		</BoxWrapper>
	);
} );

const ChartTitle = memo( ( { title } ) => {
	const { hasDateFilter } = useContext( WebVitalsChartsContext );
	return (
		<Stack direction="row" spacing={ 2 } sx={ { mb: 2 } } divider={ <Divider orientation="vertical" /> }>

			<Typography color="primary" fontWeight="xl">{ title }</Typography>
			{ ! hasDateFilter && (
				<Typography >{ __( 'Last 24 hours results' ) }</Typography>
			) }
		</Stack>
	);
} );
const BoxWrapper = memo( ( { children } ) => (
	<Sheet variant="outlined" sx={ ( theme ) => ( {
		borderRadius: theme.vars.radius.md,
		p: 2,
	} ) } >
		{ children }
	</Sheet>
) );

const ChartLoader = memo( () => (
	<Box sx={ { m: 2, display: 'flex', justifyContent: 'center' } }>
		<Box display="flex" alignItems="center" flexDirection="column">
			<CircularProgress />
			<Typography sx={ { mt: 2 } }>{ __( 'Loading chart data…' ) }</Typography>
		</Box>
	</Box>
) );

const NothingToShow = memo( () => {
	return (
		<Box sx={ { m: 2, display: 'flex', justifyContent: 'center' } }>
			<Alert
				variant="soft"
				color="primary"
				sx={ { flexDirection: 'column', gap: 0 } }
			>
				<Typography color="primary" fontWeight="xl">{ __( 'No data found' ) }</Typography>
				<Typography fontSize="xs">{ __( 'Try to define more precise filters.' ) }</Typography>
			</Alert>
		</Box>
	);
} );

export default memo( WebVitalsCharts );
