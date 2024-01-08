import { memo, useContext, useMemo, createContext, useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { useQueryClient } from '@tanstack/react-query';

import useTableStore from '../hooks/useTableStore';
import { filtersArray } from '../hooks/useFilteringSorting';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';
import useChartQuery from '../queries/useChartQuery';

import AreaChart from '../components/charts/AreaChart';
import WorldMapChart from '../components/charts/WorldMapChart';
import TableFilters from '../components/TableFilters';

import { getDateDaysBefore } from '../lib/helpers';
import { chartDataFormatMap, chartDataFormatMetric, reduceFilteredCharts } from '../lib/chartsHelpers';

import { header } from '../tables/WebVitalsTable';
import { ChartLoader, ChartNoData, ChartTitle, ChartWrapper } from '../components/charts/elements';
import RefreshButton from '../elements/RefreshButton';

import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';

const useFetchingChartsData = ( queryData ) => {
	const { isFetching: isFetchingMetric } = useChartQuery( 'web-vitals/charts/metric-type', queryData, chartDataFormatMetric );
	const { isFetching: isFetchingCounty } = useChartQuery( 'web-vitals/charts/country', queryData, chartDataFormatMap );

	return isFetchingMetric || isFetchingCounty;
};

const WebVitalsChartsContext = createContext( {} );
const lastDaysRange = 7;

const WebVitalsCharts = ( { slug } ) => {
	let filters = useTableStore( ( state ) => state.tables[ slug ]?.filters );
	filters = filters ? filtersArray( filters ) : {};

	const hasDateFilter = useMemo( () => Object.values( filters ).filter( ( filter ) => filter.col === 'created' ).length > 0, [ filters ] );

	const queryData = useMemo( () => hasDateFilter
		? { filters }
		: { filters: [ ...[ { col: 'created', op: '>', val: getDateDaysBefore( lastDaysRange ) } ], ...Object.values( filters ) ] }
	, [ filters, hasDateFilter ] );

	return (
		<WebVitalsChartsContext.Provider value={ { slug, queryData, hasDateFilter, filters } }>
			<Stack spacing={ 2 }>
				<Box sx={ {
					zIndex: 2, // increase z-index for filters floating panel over charts
				} }>
					<Box display="flex">
						<TableFilters customSlug={ slug } customData={ { header } } />
						<RefreshCharts />
					</Box>
				</Box>
				<Stack spacing={ 4 }>
					<MetricChart />
					<CountryChart />
				</Stack>

			</Stack>
		</WebVitalsChartsContext.Provider>
	);
};

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

const MetricChart = memo( () => {
	const { slug, hasDateFilter, queryData, filters } = useContext( WebVitalsChartsContext );
	const { data, isSuccess: isSuccessChartData, isLoading: isLoadingChartData, isFetching: isFetchingChartData } = useChartQuery( 'web-vitals/charts/metric-type', queryData, chartDataFormatMetric );
	const { columnTypes, isSuccessColumnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const isLoading = isLoadingChartData || isLoadingColumnTypes;
	const isSuccess = isSuccessChartData && isSuccessColumnTypes;
	const metricTypes = columnTypes?.metric_type?.values;

	let metricTypesLegend = null;
	if ( metricTypes ) {
		metricTypesLegend = {};
		for ( const m in metricTypes ) {
			// get just shortcuts from metric types for legend
			metricTypesLegend[ m ] = metricTypes[ m ].split( ' ' )[ 0 ];
		}
	}

	return (
		<ChartWrapper>
			<ChartTitle
				title={ __( 'Metric chart' ) }
				description={ ! hasDateFilter &&
					// translators: %s is generated number of days, do not change it
					__( 'Last %s days results' ).replace( '%s', lastDaysRange )
				}
			/>

			{ ( isLoading ) && <ChartLoader /> }

			{ ( isSuccess && metricTypes && ! isLoading ) &&
				( data && data.length > 0
					? <AreaChart
						data={ data }
						chartsMapper={ reduceFilteredCharts( metricTypes, 'metric_type', filters ) }
						legendTitlesMapper={ metricTypesLegend }
						xAxisKey="time_bucket_formatted"
						height={ 300 }
						isReloading={ isFetchingChartData }
					/>
					: <ChartNoData />
				)

			}
		</ChartWrapper>
	);
} );

const CountryChart = memo( () => {
	const { slug, hasDateFilter, queryData, filters } = useContext( WebVitalsChartsContext );
	const { data, isSuccess: isSuccessChartData, isLoading: isLoadingChartData, isFetching: isFetchingChartData } = useChartQuery( 'web-vitals/charts/country', queryData, chartDataFormatMap );
	const { columnTypes, isSuccessColumnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const isLoading = isLoadingChartData || isLoadingColumnTypes;
	const isSuccess = isSuccessChartData && isSuccessColumnTypes;
	const metricTypes = columnTypes?.metric_type?.values;

	return (
		<ChartWrapper>
			<ChartTitle
				title={ __( 'Country chart' ) }
				description={ ! hasDateFilter &&
					// translators: %s is generated number of days, do not change it
					__( 'Last %s days results' ).replace( '%s', lastDaysRange )
				}
			/>

			{ isLoading && <ChartLoader /> }

			{ ( isSuccess && metricTypes && ! isLoading ) &&
				( data && Object.keys( data ).length > 0
					? <WorldMapChart
						data={ data }
						optionsMapper={ reduceFilteredCharts( metricTypes, 'metric_type', filters ) }
						isReloading={ isFetchingChartData }
					/>
					: <ChartNoData />
				)

			}
		</ChartWrapper>
	);
} );

export default memo( WebVitalsCharts );
