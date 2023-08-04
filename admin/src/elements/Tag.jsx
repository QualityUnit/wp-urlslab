import { ReactComponent as Close } from '../assets/images/icons/icon-close.svg';
import '../assets/styles/elements/_Tag.scss';
import hexToHSL from '../lib/hexToHSL';

export default function Tag( { props, type, autoTextColor, lightnessTreshold, fullSize, className, children, style, shape, fill, size, onClick, onDelete } ) {
	// Into prop autoTextColor add the incoming color for background to change text color to white (or other)
	const setTextColor = () => {
		const { hue, saturation, lightness } = autoTextColor ? hexToHSL( autoTextColor ) : {};
		if ( ! lightness ) {
			return '';
		}
		if ( lightness < ( lightnessTreshold || 75 ) ) {
			return '#fff';
		}
	};

	return (
		type === 'button'
			? <button { ...props } onClick={ onClick } className={ `urlslab-tag ${ fullSize ? 'fullSize' : '' } ${ className ? className : '' } ${ size ? size : '' } ${ shape ? shape : '' } ${ fill ? 'fill' : '' }` } style={ autoTextColor ? { ...style, color: setTextColor() } : { ...style } }>
				{ children }
				{ onDelete && <Close onClick={ onDelete } className="urlslab-tag-close" /> }
			</button>
			: <span { ...props } className={ `urlslab-tag ${ fullSize ? 'fullSize' : '' } ${ className ? className : '' } ${ size ? size : '' } ${ shape ? shape : '' } ${ fill ? 'fill' : '' }` } style={ autoTextColor ? { ...style, color: setTextColor() } : { ...style } }>
				{ children }
				{ onDelete && <Close onClick={ onDelete } className="urlslab-tag-close" /> }
			</span>
	);
}
