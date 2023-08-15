import { date, getSettings } from '@wordpress/date';

export default function DateTimeFormat( { datetime, oneLine } ) {
	const dateFormatted = date( getSettings().formats.date, datetime );
	const time = date( getSettings().formats.time, datetime );

	return (
		<>
			{ dateFormatted }
			{ ! oneLine
				? <br />
				: ' '
			}
			<span className="c-grey-darker">{ time.replace( /: /, ':' ) }</span>
		</>
	);
}
