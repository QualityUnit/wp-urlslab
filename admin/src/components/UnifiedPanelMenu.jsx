import { useI18n } from '@wordpress/react-i18n';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_UnifiedPanelMenu.scss';

export default function UnifiedPanelMenu( ) {
	const { __ } = useI18n();
	const { activePanel, activatePanel, rowToEdit, options } = useTablePanels();

	return (
		<ul className="urlslab-unifiedPanelMenu">
			{ Object.keys( rowToEdit ).length > 0 &&
			<li className={ `${ activePanel === 'rowEditor' && 'active' }` }>
				<button onClick={ () => activatePanel( 'rowEditor' ) }>{ __( 'Edit row' ) }</button></li>
			}
			{ options.length > 0 &&
					options.map( ( option, index ) => {
						const { title } = option.detailsOptions;
						return <li key={ title } className={ `${ activePanel === index ? 'active' : '' }` }><button onClick={ () => activatePanel( index ) }>{ title }</button></li>;
					} )
			}
		</ul>
	);
}
