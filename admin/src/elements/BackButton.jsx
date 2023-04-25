import { ReactComponent as IconArrow } from '../assets/images/icons/icon-arrow.svg';

import '../assets/styles/elements/_BackButton.scss';

export default function BackButton( { className, children, onClick } ) {
	return (
		<div className={ `urlslab-backButton ${ className }` }>
			<button
				type="button"
				onClick={ onClick }
				className="urlslab-backButton-button"
			>
				<IconArrow />
				{ children }
			</button>
		</div>
	);
}
