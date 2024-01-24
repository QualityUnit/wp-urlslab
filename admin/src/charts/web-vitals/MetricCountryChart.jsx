import { memo, useContext, useCallback } from 'react';

import useColumnTypesQuery from '../../queries/useColumnTypesQuery';
import useChartQuery from '../../queries/useChartQuery';

import { chartDataFormatMap } from '../../lib/chartsHelpers';
import { ChartLoader, ChartNoData, ChartStatusInfo } from '../../components/charts/elements';
import { getMetricRatingCode, getMetricWithUnit, metricRatingTitles, metricsRatingBreakpoints, useMetricRatingColors, useMetricTypes } from '../../lib/metricChartsHelpers';
import WorldMapChart from '../../components/charts/WorldMapChart';

import { WebVitalsChartsContext } from '../WebVitalsCharts';

const MetricCountryChart = memo( () => {
	const metricRatingColors = useMetricRatingColors();
	const { slug, queryData, selectedMetric } = useContext( WebVitalsChartsContext );
	const { shortenedMetricTypes } = useMetricTypes( slug );
	const { isSuccessColumnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );
	const { data, isSuccess: isSuccessChartData, isLoading: isLoadingChartData, isFetching: isFetchingChartData } = useChartQuery( 'web-vitals/charts/country', queryData, chartDataFormatMap );

	const isLoading = isLoadingChartData || isLoadingColumnTypes;
	const isSuccess = isSuccessChartData && isSuccessColumnTypes;

	const ratingBreakpoints = metricsRatingBreakpoints[ selectedMetric ];

	// custom action to color countries of chart
	const getCountryColor = useCallback( ( value ) => {
		const rating = getMetricRatingCode( value, ratingBreakpoints );
		return metricRatingColors[ rating ];
	}, [ metricRatingColors, ratingBreakpoints ] );

	// custom content appended to chart tooltip
	const handleAppendTooltipContent = useCallback( ( { sourceData } ) => {
		const currentValue = sourceData[ selectedMetric ];
		const rating = getMetricRatingCode( currentValue, ratingBreakpoints );
		const color = metricRatingColors[ rating ];
		const status = metricRatingTitles[ rating ];
		return (
			<ChartStatusInfo color={ color } status={ status } />
		);
	}, [ metricRatingColors, selectedMetric, ratingBreakpoints ] );

	return (
		<>
			{ isLoading && <ChartLoader /> }

			{ ( isSuccess && shortenedMetricTypes && ! isLoading ) &&
				// eslint-disable-next-line no-nested-ternary
				( data && Object.keys( data ).length > 0
					? <WorldMapChart
						data={ data }
						//optionsMapper={ reduceFilteredCharts( metricTypes, 'metric_type', filters ) }
						optionsMapper={ { [ selectedMetric ]: shortenedMetricTypes[ selectedMetric ] } }
						countryColorKey={ selectedMetric }
						isReloading={ isFetchingChartData }
						handleGetCountryColor={ getCountryColor }
						appendTooltipContent={ handleAppendTooltipContent }
						handleTooltipValue={ ( value ) => getMetricWithUnit( value, selectedMetric ) }
					/>
					: isFetchingChartData
						? <ChartLoader />
						: <ChartNoData />
				)

			}
		</>
	);
} );

export default memo( MetricCountryChart );
