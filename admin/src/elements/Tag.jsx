import '../assets/styles/elements/_Tag.scss';

export default function Tag( { props, type, className, children, style, shape, fill, size, onClick } ) {
	return (
		type === 'button'
			? <button { ...props } onClick={ onClick } className={ `urlslab-tag ${ className || '' } ${ size || '' } ${ shape || '' } ${ fill && 'fill' }` } style={ style }>
				{ children }
			</button>
			: <span { ...props }className={ `urlslab-tag ${ className || '' } ${ size || '' } ${ shape || '' } ${ fill && 'fill' }` } style={ style }>
				{ children }
			</span>
	);
}
