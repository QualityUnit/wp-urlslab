import { memo, useContext, useCallback } from 'react';

import useColumnTypesQuery from '../../queries/useColumnTypesQuery';
import useChartQuery from '../../queries/useChartQuery';

import { chartDataFormatMetric } from '../../lib/chartsHelpers';
import { getMetricRatingCode, metricRatingTitles, metricsRatingBreakpoints, useMetricRatingColors, useMetricReferenceAreas, useMetricReferenceLines, useMetricTypes } from '../../lib/metricChartsHelpers';
import { ChartLoader, ChartNoData, ChartStatusInfo } from '../../components/charts/elements';
import AreaChart from '../../components/charts/AreaChart';

import { WebVitalsChartsContext } from '../WebVitalsCharts';

const MetricChart = memo( () => {
	const { slug, queryData, selectedMetric } = useContext( WebVitalsChartsContext );
	const { data, isSuccess: isSuccessChartData, isLoading: isLoadingChartData, isFetching: isFetchingChartData } = useChartQuery( 'web-vitals/charts/metric-type', queryData, chartDataFormatMetric );
	const { isSuccessColumnTypes, isLoadingColumnTypes } = useColumnTypesQuery( slug );

	const isLoading = isLoadingChartData || isLoadingColumnTypes;
	const isSuccess = isSuccessChartData && isSuccessColumnTypes;

	const metricRatingColors = useMetricRatingColors();
	const { shortenedMetricTypes } = useMetricTypes( slug );

	const ratingBreakpoints = metricsRatingBreakpoints[ selectedMetric ];

	// colored rating reference lines and areas
	const refLines = useMetricReferenceLines( { data, selectedMetric } );
	const refAreas = useMetricReferenceAreas( { data, selectedMetric } );

	// custom content appended to chart tooltip
	const handleAppendTooltipContent = useCallback( ( payload ) => {
		const currentValue = payload[ 0 ]?.value;
		const rating = getMetricRatingCode( currentValue, ratingBreakpoints );
		const color = metricRatingColors[ rating ];
		const status = metricRatingTitles[ rating ];
		return (
			<ChartStatusInfo color={ color } status={ status } />
		);
	}, [ metricRatingColors, ratingBreakpoints ] );

	return (
		<>
			{ ( isLoading ) && <ChartLoader /> }

			{ ( isSuccess && shortenedMetricTypes && ! isLoading ) &&
				// eslint-disable-next-line no-nested-ternary
				( data && data.length > 0
					? <AreaChart
						height={ 300 }
						data={ data }
						chartsMapper={ { [ selectedMetric ]: shortenedMetricTypes[ selectedMetric ] } }
						xAxisKey="time_bucket_formatted"
						yAxisProps={ { tickCount: 1, interval: -1 } }
						isReloading={ isFetchingChartData }
						referenceLines={ refLines }
						referenceAreas={ refAreas }
						cartesianGridProps={ { horizontal: false } }
						appendTooltipContent={ handleAppendTooltipContent }
						showReferenceAreasOnHover
						hideLegend

					/>
					: isFetchingChartData
						? <ChartLoader />
						: <ChartNoData />
				)

			}
		</>
	);
} );

export default memo( MetricChart );
