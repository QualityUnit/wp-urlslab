import { memo, useState } from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

import { getDateFnsFormat } from '../lib/helpers';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

function DateRangeButton( { startDate, endDate, className, handleSelect, customButtonText, buttonProps, tooltipProps } ) {
	const { date, getSettings } = window.wp.date;
	const dateToString = ( datetime ) => {
		return date( getSettings().formats.date, datetime );
	};

	const [ range, setRange ] = useState( [ {
		startDate: new Date( startDate ),
		endDate: new Date( endDate ),
		key: 'selection',
	} ] );
	const [ buttonText, setButtonText ] = useState( dateToString( startDate ) + ' - ' + dateToString( endDate ) );
	const [ showCalendar, setShowCalendar ] = useState( false );

	const toggleCalendar = () => {
		setShowCalendar( ! showCalendar );
	};
	const onSelect = ( newRange ) => {
		setRange( [ newRange.selection ] );
		setButtonText( dateToString( newRange.selection.startDate ) + ' - ' + dateToString( newRange.selection.endDate ) );
		handleSelect( newRange.selection );
	};

	return (
		<Tooltip
			variant="outlined"
			open={ showCalendar }
			title={
				<ClickAwayListener onClickAway={ toggleCalendar }>
					<Box>
						<DateRangePicker
							showSelectionPreview={ true }
							moveRangeOnFirstSelection={ false }
							retainEndDateOnFirstSelection={ true }
							className={ className }
							ranges={ range }
							months={ 2 }
							direction="horizontal"
							onChange={ onSelect }
							maxDate={ new Date() }
							dateDisplayFormat={ getDateFnsFormat().date }
							weekStartsOn={ getSettings().l10n.startOfWeek }
						/>
					</Box>
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
