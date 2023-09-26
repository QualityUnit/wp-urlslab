import { memo, useState } from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

import { getDateFnsFormat } from '../lib/helpers';

import Button from '@mui/joy/Button';

import '../assets/styles/components/_DateRangePicker.scss';

function DateRangeButton( { startDate, endDate, className, handleSelect } ) {
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
		<div className="urlslab-date-range-picker">

			{ range.startDate }

			<Button color="neutral" variant="soft" onClick={ toggleCalendar }>
				{ buttonText }
			</Button>

			{
				showCalendar && <div className="urlslab-date-range-picker-calendar">
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
				</div>
			}

		</div>
	);
}
export default memo( DateRangeButton );
