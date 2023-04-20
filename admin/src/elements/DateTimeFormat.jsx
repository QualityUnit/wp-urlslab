export default function DateTimeFormat( { datetime } ) {
	const date = new Date( datetime );
	return (
		<>
			{ date.toLocaleDateString( window.navigator.language ) }<br />
			<span className="c-grey-darker">{ date.toLocaleTimeString( window.navigator.language ) }</span>
		</>
	);
}
