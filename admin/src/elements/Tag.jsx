import { ReactComponent as Close } from '../assets/images/icons/icon-close.svg';
import '../assets/styles/elements/_Tag.scss';

export default function Tag( { props, type, fullSize, className, children, style, shape, fill, size, onClick, onDelete } ) {
	return (
		type === 'button'
			? <button { ...props } onClick={ onClick } className={ `urlslab-tag ${ fullSize ? 'fullSize' : '' } ${ className || '' } ${ size || '' } ${ shape || '' } ${ fill && 'fill' }` } style={ style }>
				{ children }
				{ onDelete && <Close onClick={ onDelete } className="urlslab-tag-close" /> }
			</button>
			: <span { ...props } className={ `urlslab-tag ${ fullSize ? 'fullSize' : '' } ${ className || '' } ${ size || '' } ${ shape || '' } ${ fill && 'fill' }` } style={ style }>
				{ children }
				{ onDelete && <Close onClick={ onDelete } className="urlslab-tag-close" /> }
			</span>
	);
}
