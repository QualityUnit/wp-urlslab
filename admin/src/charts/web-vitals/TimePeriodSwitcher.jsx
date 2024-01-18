import { memo, useContext, useCallback, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import { includesFilter, useFilter } from '../../hooks/useFilteringSorting';
import { dateWithTimezone, getDateDaysBefore, textFromTimePeriod } from '../../lib/helpers';

import DateRangeButton from '../../elements/DateRangeButton';
import { header } from '../../tables/WebVitalsTable';
import { WebVitalsChartsContext } from '../WebVitalsCharts';

import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';

export const defaultTimePeriod = 7;
export const timePeriods = {
	3: __( '3 days' ),
	7: __( '7 days' ),
	14: __( '14 days' ),
	30: __( '30 days' ),
};

const TimePeriodSwitcher = memo( () => {
	const { slug, startDateFilterVal, endDateFilterVal, filtersArray, selectedTimePeriod, setSelectedTimePeriod } = useContext( WebVitalsChartsContext );
	const { filters, dispatchSetFilters } = useFilter( slug, { header } );

	const setSelectedDateFilter = useCallback( ( newDate ) => {
		const isSingleDate = typeof newDate === 'string';
		const startDate = isSingleDate ? newDate : newDate?.startDate;
		const endDate = isSingleDate ? null : newDate?.endDate;

		const updatedFilters = { ...filters };
		for ( const key in filters ) {
			if ( key.replace( /(.+?)@\d+/, '$1' ) === 'created' ) {
				delete updatedFilters[ key ];
			}
		}

		if ( startDate && endDate ) {
			dispatchSetFilters( {
				[ `created@${ Date.now() }` ]: { op: '>', val: startDate, keyType: 'date' },
				[ `created@${ Date.now() + 1 }` ]: { op: '<', val: endDate, keyType: 'date' },
				...updatedFilters,
			} );
			return;
		}

		if ( startDate ) {
			dispatchSetFilters( {
				[ `created@${ Date.now() }` ]: { op: '>', val: startDate, keyType: 'date' },
				...updatedFilters,
			} );
			return;
		}
		dispatchSetFilters( updatedFilters );
	}, [ dispatchSetFilters, filters ] );

	// set default date filter on first load or when date filter was removed from filters by user in web vitals table
	useEffect( () => {
		if ( ! includesFilter( filtersArray, 'created', '>' ) ) {
			setSelectedDateFilter( getDateDaysBefore( defaultTimePeriod ) );
		}
	}, [ filtersArray, setSelectedDateFilter ] );

	return (
		<ButtonGroup variant="outlined" size="sm" sx={ { zIndex: 1 } }>
			{
				Object.entries( timePeriods ).map( ( [ value, title ] ) => {
					const valueAsNumber = parseInt( value );
					return (
						<Button
							key={ value }
							onClick={ () => {
								if ( selectedTimePeriod !== valueAsNumber ) {
									setSelectedTimePeriod( valueAsNumber );
									setSelectedDateFilter( getDateDaysBefore( valueAsNumber ) );
								}
							} }
							sx={ ( theme ) => ( {
								backgroundColor: theme.vars.palette.background.surface,
								...( selectedTimePeriod === valueAsNumber && {
									color: theme.vars.palette.primary.plainColor,
									backgroundColor: theme.vars.palette.primary.plainHoverBg,
								} ),
							} ) }

						>
							{ title }
						</Button>
					);
				} )
			}
			<DateRangeButton
				submitWithButton
				customButtonText={ selectedTimePeriod !== 'custom' ? __( 'Custom range' ) : textFromTimePeriod( startDateFilterVal, endDateFilterVal ) }
				startDate={ startDateFilterVal }
				endDate={ endDateFilterVal || new Date() }
				handleSelect={ ( ranges ) => {
					// set end of range to the end of day, to process also values from this day
					ranges.endDate.setHours( 23, 59, 59 );
					setSelectedTimePeriod( 'custom' );
					setSelectedDateFilter( {
						startDate: dateWithTimezone( ranges.startDate ).correctedDateFormatted,
						endDate: dateWithTimezone( ranges.endDate ).correctedDateFormatted,
					} );
				} }
				buttonProps={ {
					variant: 'outlined',
					size: 'sm',
					sx: ( theme ) => ( {
						'&:last-child': { 'data-last-child': '' },
						...( selectedTimePeriod === 'custom' && {
							color: theme.vars.palette.primary.plainColor,
							backgroundColor: theme.vars.palette.primary.plainHoverBg,
						} ),
					} ),
					// pass this attribute to html so mui can apply styling for last button in buttons group,
					// button component is not passed directly as buttons group child component
					'data-last-child': '',
				} }
				tooltipProps={ {
					placement: 'bottom-end',
				} }
			/>
		</ButtonGroup>
	);
} );

export default memo( TimePeriodSwitcher );
