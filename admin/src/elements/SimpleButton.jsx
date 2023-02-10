import '../assets/styles/elements/_SimpleButton.scss';

export default function SimpleButton( { onClick, className, children } ) {
	return (
		<button type="button"
			className={ `urlslab-simple-button ${ className }` }
			onClick={ onClick || null }
		>
			{ children }
		</button>
	);
}
