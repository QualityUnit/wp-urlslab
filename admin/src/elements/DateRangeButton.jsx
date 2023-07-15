import { memo, useState } from 'react';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Button from './Button';
import { date, getSettings } from '@wordpress/date'; // theme css file
import '../assets/styles/components/_DateRangePicker.scss';

function DateRangeButton( { startDate, endDate, className, handleSelect } ) {
	const dateToString = ( datetime ) => {
		return date( getSettings().formats.date, datetime );
	};

	const [ range, setRange ] = useState( {
		startDate: startDate || new Date().setDate( new Date().getDate() - 7 ),
		endDate: endDate || new Date(),
		key: 'selection',
	} );
	const [ showCalendar, setShowCalendar ] = useState( false );

	const toggleCalendar = () => {
		setShowCalendar( ! showCalendar );
	};
	const onSelect = ( ranges ) => {
		setRange( ranges.selection );
		handleSelect( ranges.selection );
	};

	return (
		<div className="urlslab-date-range-picker">
			<Button onClick={ toggleCalendar }>
				{ dateToString( range.startDate ) + ' - ' + dateToString( range.endDate ) }
			</Button>

			{
				showCalendar && <div className="urlslab-date-range-picker-calendar">
					<DateRangePicker
						className={ className }
						ranges={ [ range ] }
						onChange={ onSelect }
					/>
				</div>
			}

		</div>
	);
}
export default memo( DateRangeButton );
