import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as LoaderAnim } from '../assets/images/ajax-loader.svg';
import '../assets/styles/components/_Loader.scss';

export default function Loader( { children, className } ) {
	const { __ } = useI18n();

	return (
		<div className={ `urlslab-loader ${ className || '' }` }>
			<LoaderAnim className="urlslab-loader-anim" />
			<span className="urlslab-loader-text">
				{ children ? children : __( 'Loading…' ) }
			</span>
		</div>
	);
}
