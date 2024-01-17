import { memo, useState } from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

import { getDateFnsFormat } from '../lib/helpers';

import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';

function DateRangeButton( { startDate, endDate, className, handleSelect, buttonProps, tooltipProps } ) {
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
			title={
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
			}
			open={ showCalendar }
			fitContent
			{ ...tooltipProps }
		>
			<Button color="neutral" variant="soft" onClick={ toggleCalendar } { ...buttonProps }>
				{ buttonText }
			</Button>
		</Tooltip>

	);
}
export default memo( DateRangeButton );
