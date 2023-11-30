import { memo, useContext, useMemo, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import useTableStore from '../../hooks/useTableStore';
import { filtersArray } from '../../hooks/useFilteringSorting';
import { getYesterdayDate } from '../../lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { postFetch } from '../../api/fetching';
import { metric_types, metric_typesNames } from '../../tables/WebVitalsTable';
import AreaChart from '../../elements/charts/AreaChart';
import TableFilters from '../TableFilters';

const getFromYesterdayFilter = ( cellName ) => {
	const date = getYesterdayDate();
	return [ { col: cellName, op: '>', val: date } ];
};

const useChartQuery = ( slug, data, dataHandler ) => {
	return useQuery( {
		queryKey: [ slug, data ],
		queryFn: async () => {
			const response = await postFetch( slug, data );
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
const groupByTimeBucket = ( sourceArray ) => {
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
const reduceFilteredCharts = ( sourceData, filterKey, filters ) => {
	//Object.values( filters ).filter( ( filterData ) => null );
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

const WebVitalsChartsContext = createContext( {} );

const WebVitalsCharts = () => {
	const activeTable = useTableStore( ( state ) => state.activeTable );
	let filters = useTableStore( ( state ) => state.tables[ activeTable ]?.filters );
	filters = filters ? filtersArray( filters ) : {};

	const hasDateFilter = useMemo( () => Object.values( filters ).filter( ( filter ) => filter.col === 'created' ).length > 0, [ filters ] );

	const queryData = useMemo( () => hasDateFilter
		? { filters }
		: { filters: [ ...getFromYesterdayFilter( 'created' ), ...Object.values( filters ) ] }
	, [ filters, hasDateFilter ] );

	return (
		<WebVitalsChartsContext.Provider value={ { queryData, hasDateFilter, filters } }>
			<Stack spacing={ 2 }>
				<Box sx={ {
					zIndex: 2, // increase z-index for filters floating panel over charts
				} }>
					<TableFilters />
				</Box>
				<MetricChart />
			</Stack>
		</WebVitalsChartsContext.Provider>
	);
};

const MetricChart = memo( () => {
	const { queryData, filters } = useContext( WebVitalsChartsContext );
	const { data, isSuccess, isFetching } = useChartQuery( 'web-vitals/charts/metric-type', queryData, groupByTimeBucket );
	return (
		<BoxWrapper>
			<ChartTitle title={ __( 'Metric chart' ) } />

			{ isFetching && <ChartLoader /> }

			{ ( isSuccess && ! isFetching ) &&
				( data && data.length > 0
					? <AreaChart
						data={ data }
						chartsMapper={ reduceFilteredCharts( metric_typesNames, 'metric_type', filters ) }
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

const ChartTitle = memo( ( { title } ) => {
	const { hasDateFilter } = useContext( WebVitalsChartsContext );
	return (
		<Stack direction="row" spacing={ 2 } sx={ { mb: 2 } } divider={ <Divider orientation="vertical" /> }>

			<Typography color="primary" fontWeight="xl">{ title }</Typography>
			{ ! hasDateFilter && (
				<Typography >{ __( 'Last 24 hours result' ) }</Typography>
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
