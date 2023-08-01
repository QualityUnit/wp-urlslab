import { useI18n } from '@wordpress/react-i18n';
import classNames from 'classnames';

import { ReactComponent as LoaderAnim } from '../assets/images/ajax-loader.svg';

import '../assets/styles/components/_Loader.scss';

export default function Loader( { children, className, isFullscreen } ) {
	const { __ } = useI18n();

	return (
		<div
			className={ classNames( [
				'urlslab-loader',
				className ? className : null,
				isFullscreen ? 'fullscreen' : null,
			] ) }
		>
			<LoaderAnim className="urlslab-loader-anim" />
			<span className="urlslab-loader-text">
				{ children ? children : __( 'Loading…' ) }
			</span>
		</div>
	);
}
