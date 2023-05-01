import '../assets/styles/elements/_Tag.scss';

export default function Tag( { className, children, style, type, fill, size, onClick } ) {
	return (
		<span onClick={ onClick } className={ `urlslab-tag ${ className || '' } ${ size || '' } ${ type || '' } ${ fill && 'fill' }` } style={ style }>
			{ children }
		</span>
	);
}
