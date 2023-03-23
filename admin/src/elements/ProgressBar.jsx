// import { useRef } from 'react';
import '../assets/styles/elements/_ProgressBar.scss';

// const time = 0;
export default function ProgressBar( { notification, value, className } ) {
	return (
		<div className={ `urlslab-progressBar-wrapper ${ className || '' }` }>
			<progress className="urlslab-progressBar" value={ value } max="100"></progress>
			<span className="urlslab-progressBar-timer">{ notification } </span>
		</div>
	);
}
