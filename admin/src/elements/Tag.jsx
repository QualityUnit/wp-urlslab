import '../assets/styles/elements/_Tag.scss';

export default function Tag( { className, children, style, fill, size } ) {
	return (
		<span className={ `urlslab-tag ${ className || '' } ${ size || '' } ${ fill && 'fill' }` } style={ style }>
			{ children }
		</span>
	);
}
