import { date, getSettings } from '@wordpress/date';

export default function DateTimeFormat( { datetime } ) {
	const dateFormatted = date( getSettings().formats.date, datetime );
	const time = date( getSettings().formats.time, datetime );

	return (
		<>
			{ dateFormatted }<br />
			<span className="c-grey-darker">{ time }</span>
		</>
	);
}
