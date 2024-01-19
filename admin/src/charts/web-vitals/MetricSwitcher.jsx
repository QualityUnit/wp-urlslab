import { memo, useContext, useCallback, useEffect } from 'react';

import { includesFilter, useFilter } from '../../hooks/useFilteringSorting';

import { header } from '../../tables/WebVitalsTable';
import { defualtMetric, useMetricTypes } from '../../lib/metricChartsHelpers';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';

import { WebVitalsChartsContext } from '../WebVitalsCharts';

const MetricSwitcher = memo( () => {
	const { slug, selectedMetric, filtersArray } = useContext( WebVitalsChartsContext );
	const { shortenedMetricTypes } = useMetricTypes( slug );
	const { filters, handleSaveFilter, dispatchSetFilters } = useFilter( slug, { header } );
	const { metricTypes } = useMetricTypes( slug );

	const addNewMetricFilter = useCallback( ( newMetricType ) => {
		handleSaveFilter( { filterKey: 'metric_type', filterOp: '=', filterVal: newMetricType, keyType: 'menu', filterValMenu: metricTypes } );
	}, [ handleSaveFilter, metricTypes ] );

	const setSelectedMetricFilter = useCallback( ( newMetricType ) => {
		// when there is already metric filter, just replace it
		if ( includesFilter( filtersArray, 'metric_type', '=' ) ) {
			const newFilters = {};
			for ( const key in filters ) {
				newFilters[ key ] = key.replace( /(.+?)@\d+/, '$1' ) === 'metric_type' && filters[ key ].op === '='
					? { ...filters[ key ], val: newMetricType }
					: filters[ key ];
			}
			dispatchSetFilters( newFilters );
			return;
		}

		addNewMetricFilter( newMetricType );
	}, [ addNewMetricFilter, dispatchSetFilters, filters, filtersArray ] );

	const handleSelectedMetric = useCallback( ( newMetricType ) => {
		setSelectedMetricFilter( newMetricType );
	}, [ setSelectedMetricFilter ] );

	// set default metric on first load or when selected metric was removed from filters by user in web vitals table
	useEffect( () => {
		if ( metricTypes && ! includesFilter( filtersArray, 'metric_type', '=' ) ) {
			setSelectedMetricFilter( defualtMetric );
		}
	}, [ metricTypes, filtersArray, setSelectedMetricFilter ] );

	return (
		<Box>
			{ shortenedMetricTypes &&
				<ButtonGroup variant="outlined" size="sm" sx={ { zIndex: 1 } }>
					{
						Object.entries( shortenedMetricTypes ).map( ( [ key, name ] ) => {
							return (
								<Button
									key={ key }
									onClick={ () => {
										if ( selectedMetric === key ) {
											return;
										}
										handleSelectedMetric( key );
									} }
									sx={ ( theme ) => ( {
										backgroundColor: theme.vars.palette.background.surface,
										...( selectedMetric === key && {
											color: theme.vars.palette.primary.plainColor,
											backgroundColor: theme.vars.palette.primary.plainHoverBg,
										} ),
									} ) }
									wider
								>
									{ shortenedMetricTypes[ key ] ? shortenedMetricTypes[ key ] : name }
								</Button>
							);
						} )
					}
				</ButtonGroup>
			}
		</Box>
	);
} );

export default memo( MetricSwitcher );
