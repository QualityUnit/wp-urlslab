import '../assets/styles/elements/_DiffButton.scss';

export default function DiffButton( { className, children, onClick } ) {
	return (
		<div className={ `urlslab-diff ${ className }` }>
			<button
				type="button"
				onClick={ onClick }
				className="urlslab-diff-button"
			>
				{ children }
			</button>
		</div>
	);
}
