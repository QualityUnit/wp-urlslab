import { useI18n } from '@wordpress/react-i18n';
import '../assets/styles/elements/_Tooltip.scss';

export default function Tooltip({ active, center, className, children }) {
	const { __ } = useI18n();
	return (
		<div className={`urlslab-tooltip ${className || ''} ${center ? 'align-center' : ''} ${active ? 'active' : ''}`}>
			{__(children)}
		</div>
	)
}
