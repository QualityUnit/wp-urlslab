export default function DateTimeFormat( { datetime, oneLine } ) {
	const { date, getSettings } = window.wp.date;
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
