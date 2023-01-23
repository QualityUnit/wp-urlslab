import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as LoaderAnim } from '../assets/images/ajax-loader.svg';
import '../assets/styles/components/_Loader.scss';

export default function Loader( { children } ) {
	const { __ } = useI18n();

	return (
		<div className="urlslab-loader">
			<LoaderAnim className="urlslab-loader-anim" />
			{ children ? children : __( 'Loading…' ) }
		</div>
	);
}
