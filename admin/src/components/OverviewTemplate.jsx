import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import AboutIcon from '../assets/images/icons/icon-overview-about.svg';
import IntegrateIcon from '../assets/images/icons/icon-overview-integrate.svg';
import FaqIcon from '../assets/images/icons/icon-overview-faq.svg';

import useModulesQuery from '../queries/useModulesQuery';

import '../assets/styles/components/_OverviewTemplate.scss';

export default function Overview( { moduleId, noFAQ, noIntegrate, title, customSections, section, children } ) {
	const { __ } = useI18n();
	const [ active, setActive ] = useState( 'about' );
	const { data: modules } = useModulesQuery();
	const moduleData = modules ? modules[ moduleId ] : null;

	const handleMenu = ( val ) => {
		setActive( val );
		section( val );
	};

	return (

		<div className="urlslab-overview">
			<div className="urlslab-panel flex-tablet fadeInto">
				<ul className="urlslab-overview-menu">
					<li className={ `urlslab-overview-menuItem ${ active === 'about' ? 'active' : '' }` }><button onClick={ () => handleMenu( 'about' ) }>
						<span className="urlslab-overview-menuIcon">
							<img src={ AboutIcon } alt={ __( 'About' ) } />
						</span>
						{ __( 'About module' ) }</button>
					</li>
					{
						! noIntegrate &&
						<li className={ `urlslab-overview-menuItem ${ active === 'integrate' ? 'active' : '' }` }><button onClick={ () => handleMenu( 'integrate' ) }>
							<span className="urlslab-overview-menuIcon">
								<img src={ IntegrateIcon } alt={ __( 'How to integrate' ) } />
							</span>
							{ __( 'How to integrate' ) }</button>
						</li>
					}
					{ customSections?.length > 0 &&
					customSections.map( ( sect ) => {
						const { id, title: sectionTitle, icon } = sect;
						return <li className={ `urlslab-overview-menuItem ${ active === id ? 'active' : '' }` } key={ id }><button onClick={ () => handleMenu( id ) }>
							{ icon &&
								<span className="urlslab-overview-menuIcon">
									<img src={ icon } alt={ sectionTitle } />
								</span>
							}
							{ sectionTitle }
						</button></li>;
					} )
					}
					{
						! noFAQ &&
						<li className={ `urlslab-overview-menuItem ${ active === 'faq' ? 'active' : '' }` }><button onClick={ () => handleMenu( 'faq' ) }>
							<span className="urlslab-overview-menuIcon">
								<img src={ FaqIcon } alt={ __( 'FAQ' ) } />
							</span>
							{ __( 'FAQ' ) }</button>
						</li>
					}
				</ul>
				<div className="urlslab-overview-content">
					{ title
						? <h3> { title } </h3>
						: moduleData?.title && <h3> { moduleData.title } </h3>
					}
					{ children }
				</div>
			</div>
		</div>
	);
}
