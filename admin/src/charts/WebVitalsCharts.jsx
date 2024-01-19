import { memo, useContext, useMemo, createContext, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';

import { filtersArray as getFiltersArray, getFilterVal, includesFilter, useFilter } from '../hooks/useFilteringSorting';

import { getDateDaysBefore, getDaysCountFromDate, textFromTimePeriod } from '../lib/helpers';
import { defualtMetric, useMetricTypes } from '../lib/metricChartsHelpers';
import { header } from '../tables/WebVitalsTable';

import RefreshButton from '../elements/RefreshButton';
import TableFilters from '../components/TableFilters';
import { ChartTitle, ChartWrapper } from '../components/charts/elements';
import TimePeriodSwitcher, { defaultTimePeriod, timePeriods } from './web-vitals/TimePeriodSwitcher';

import MetricChart from './web-vitals/MetricChart';
import MetricCountryChart from './web-vitals/MetricCountryChart';

import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import MetricSwitcher from './web-vitals/MetricSwitcher';

const useFetchingChartsData = ( queryData ) => {
	const isFetchingMetric = useIsFetching( { queryKey: [ 'web-vitals/charts/metric-type', queryData ] } );
	const isFetchingCountry = useIsFetching( { queryKey: [ 'web-vitals/charts/country', queryData ] } );
	return isFetchingMetric || isFetchingCountry;
};

export const WebVitalsChartsContext = createContext( {} );

const WebVitalsCharts = ( { slug } ) => {
	const { filters } = useFilter( slug, { header } );
	const filtersArray = useMemo( () => getFiltersArray( filters ), [ filters ] );

	const startDateFilterVal = useMemo( () => getFilterVal( filtersArray, 'created', '>' ) || getDateDaysBefore( defaultTimePeriod ), [ filtersArray ] );
	const endDateFilterVal = useMemo( () => getFilterVal( filtersArray, 'created', '<' ), [ filtersArray ] );
	const selectedMetric = useMemo( () => getFilterVal( filtersArray, 'metric_type', '=' ) || defualtMetric, [ filtersArray ] );

	// get default value for state, filters were possible changed before first rendering, ie. from web vitals table page
	const getDefaultSelectedTimePeriod = useCallback( () => {
		// if both dates, it's custom range
		if ( startDateFilterVal && endDateFilterVal ) {
			return 'custom';
		}
		// if only start date, try to restore "x days" period from date in filter
		if ( startDateFilterVal ) {
			const daysCount = getDaysCountFromDate( startDateFilterVal );
			if ( daysCount && timePeriods.hasOwnProperty( daysCount ) ) {
				return daysCount;
			}
		}
		return defaultTimePeriod;
	}, [ endDateFilterVal, startDateFilterVal ] );

	const [ selectedTimePeriod, setSelectedTimePeriod ] = useState( getDefaultSelectedTimePeriod() );

	// data for chart api request
	const queryData = useMemo( () => {
		// metric not included in request payload, we'll fetch all metrics in one query
		const newFiltersPayload = [ ...filtersArray ].filter( ( f ) => f.col !== 'metric_type' );

		// if filters doesn't include at least required start date, ie. on first load, add it to query
		return includesFilter( filtersArray, 'created', '>' )
			? { filters: newFiltersPayload }
			: { filters: [ ...[ { col: 'created', op: '>', val: startDateFilterVal } ], ...Object.values( newFiltersPayload ) ] };
	}, [ filtersArray, startDateFilterVal ] );

	return (
		<WebVitalsChartsContext.Provider value={ { slug, queryData, selectedMetric, startDateFilterVal, endDateFilterVal, filtersArray, selectedTimePeriod, setSelectedTimePeriod } }>
			<Stack spacing={ 2 }>
				<Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={ { zIndex: 2 } }>
					<TableFilters customSlug={ slug } customData={ { header } } hiddenFilters={ [ 'metric_type', 'created' ] } />
					<RefreshCharts />
				</Stack>
				<Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
					<MetricSwitcher />
					<TimePeriodSwitcher />
				</Stack>
				<Stack spacing={ 4 }>
					<ChartWrapper>
						<ChartTitle
							title={ <Title /> }
							description={ __( 'Average metric value in selected time range.' ) }
						/>
						<MetricChart />
					</ChartWrapper>
					<ChartWrapper>
						<ChartTitle
							title={ <Title /> }
							description={ __( 'Average metric value per country in selected time range.' ) }
						/>
						<MetricCountryChart />
					</ChartWrapper>
				</Stack>
			</Stack>
		</WebVitalsChartsContext.Provider>
	);
};

const Title = memo( () => {
	const { slug, selectedTimePeriod, selectedMetric, startDateFilterVal, endDateFilterVal } = useContext( WebVitalsChartsContext );
	const { metricTypes } = useMetricTypes( slug );
	return <>
		<Typography color="primary" fontWeight="xl">{ metricTypes && metricTypes[ selectedMetric ] }</Typography>
		<Divider orientation="vertical" />
		<Typography color="primary" fontWeight="xl">{ selectedTimePeriod === 'custom' ? textFromTimePeriod( startDateFilterVal, endDateFilterVal ) : timePeriods[ selectedTimePeriod ] }</Typography>
	</>;
} );

const RefreshCharts = memo( () => {
	const queryClient = useQueryClient();
	const { queryData } = useContext( WebVitalsChartsContext );
	const fetchingChartsData = useFetchingChartsData( queryData );

	const refreshCharts = useCallback( () => {
		queryClient.invalidateQueries( [ 'web-vitals/charts/metric-type' ] );
		queryClient.invalidateQueries( [ 'web-vitals/charts/country' ] );
	}, [ queryClient ] );

	return (
		<RefreshButton
			tooltipText={ __( 'Refresh charts' ) }
			handleRefresh={ refreshCharts }
			className="ma-left"
			loading={ fetchingChartsData }
		/>
	);
} );

export default memo( WebVitalsCharts );
