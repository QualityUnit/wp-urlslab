import SvgIcon from './SvgIcon';

import '../assets/styles/elements/_BackButton.scss';

export default function BackButton( { className, children, onClick } ) {
	return (
		<div className={ `urlslab-backButton ${ className }` }>
			<button
				type="button"
				onClick={ onClick }
				className="urlslab-backButton-button"
			>
				<SvgIcon name="arrow" />
				{ children }
			</button>
		</div>
	);
}
