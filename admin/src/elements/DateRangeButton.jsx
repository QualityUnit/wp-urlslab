import { memo, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

import { getDateFnsFormat } from '../lib/helpers';

import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useTheme } from '@mui/joy';

const { date, getSettings } = window.wp.date;
const dateToString = ( datetime ) => {
	return date( getSettings().formats.date, datetime );
};

function DateRangeButton( { startDate, endDate, className, handleSelect, customButtonText, submitWithButton, submitOnClose, buttonProps, tooltipProps } ) {
	const theme = useTheme();
	const [ range, setRange ] = useState( {
		startDate: new Date( startDate ),
		endDate: new Date( endDate ),
		key: 'selection',
	} );

	const [ buttonText, setButtonText ] = useState( dateToString( startDate ) + ' - ' + dateToString( endDate ) );
	const [ showCalendar, setShowCalendar ] = useState( false );

	const toggleCalendar = useCallback( () => {
		setShowCalendar( ( s ) => ! s );
	}, [] );

	const onSelect = useCallback( ( newRange ) => {
		setRange( newRange.selection );
		setButtonText( dateToString( newRange.selection.startDate ) + ' - ' + dateToString( newRange.selection.endDate ) );
		if ( ! submitWithButton ) {
			handleSelect( newRange.selection );
		}
	}, [ handleSelect, submitWithButton ] );

	const manualSubmit = useCallback( () => {
		handleSelect( range );
		toggleCalendar();
	}, [ handleSelect, range, toggleCalendar ] );
	return (
		<Tooltip
			variant="outlined"
			open={ showCalendar }
			title={
				<ClickAwayListener onClickAway={ () => {
					if ( submitOnClose ) {
						manualSubmit();
						return;
					}
					toggleCalendar();
				} }>
					<Stack>
						<DateRangePicker
							showSelectionPreview={ true }
							moveRangeOnFirstSelection={ false }
							retainEndDateOnFirstSelection={ true }
							className={ className }
							ranges={ [ range ] }
							months={ 2 }
							direction="horizontal"
							onChange={ onSelect }
							maxDate={ new Date() }
							dateDisplayFormat={ getDateFnsFormat().date }
							weekStartsOn={ getSettings().l10n.startOfWeek }
							rangeColors={ [ theme.vars.palette.primary[ 500 ], theme.vars.palette.primary[ 400 ], theme.vars.palette.primary[ 300 ] ] }
						/>
						{ submitWithButton &&
							<Button
								color="primary"
								variant="solid"
								size="md"
								onClick={ manualSubmit }
								sx={ { '--Button-radius': 0 } }
							>
								{ __( 'Apply selected range', 'wp-urlslab' ) }
							</Button>
						}
					</Stack>
				</ClickAwayListener>
			}
			fitContent
			{ ...tooltipProps }
		>
			<Button color="neutral" variant="soft" onClick={ toggleCalendar } { ...buttonProps }>
				{ customButtonText !== undefined ? customButtonText : buttonText }
			</Button>
		</Tooltip>

	);
}
export default memo( DateRangeButton );
