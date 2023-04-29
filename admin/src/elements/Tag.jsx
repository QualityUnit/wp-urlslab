import '../assets/styles/elements/_Tag.scss';

export default function Tag( { className, children, style, type, fill, size } ) {
	return (
		<span className={ `urlslab-tag ${ className || '' } ${ size || '' } ${ type || '' } ${ fill && 'fill' }` } style={ style }>
			{ children }
		</span>
	);
}
