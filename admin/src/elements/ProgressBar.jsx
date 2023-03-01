import '../assets/styles/elements/_ProgressBar.scss';

export default function ProgressBar( { notification, value } ) {
	return (
		<div className="urlslab-progressBar-wrapper">
			<progress className="urlslab-progressBar" value={ value } max="100"></progress>
		</div>
	);
}
