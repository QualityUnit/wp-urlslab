import { useRef } from 'react';
import '../assets/styles/elements/_ProgressBar.scss';

let time = 0;
export default function ProgressBar( { notification, value } ) {
	const timer = setInterval( () => {
		time = time + 1;

		// time.current = time.current + 1;
		// setTime( time + 1 );
	}, 1000 );
	if ( value === 100 ) {
		clearInterval( timer );
	}
	return (
		<div className="urlslab-progressBar-wrapper">
			<progress className="urlslab-progressBar" value={ value } max="100"></progress>
			<span className="urlslab-progressBar-timer">{ time }s </span>
		</div>
	);
}
