/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, postComments } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, Spinner } from '@wordpress/components';

import useModules from '../../hooks/useModules';

const slug = 'faqs';
const moduleSlug = 'urlslab-faq';

const Edit = ( { attributes, setAttributes } ) => {
	const { url, count } = attributes;
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const { moduleStatus, activateModule } = useModules( { moduleSlug } );

	return (
		<>
			{ moduleStatus && moduleStatus?.active &&
				<InspectorControls key="setting">
					<PanelBody
						title={ __( 'Options', 'wp-urlslab', 'wp-urlslab' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Page URL', 'wp-urlslab', 'wp-urlslab' ) }
							help={ __( 'Link to the page for which a FAQs should be generated.', 'wp-urlslab', 'wp-urlslab' ) }
							value={ url }
							onChange={ ( val ) => setAttributes( { url: val } ) }
						/>

						<TextControl
							label={ __( 'Number of FAQs', 'wp-urlslab', 'wp-urlslab' ) }
							help={ __( 'Define how many questions should show.', 'wp-urlslab', 'wp-urlslab' ) }
							value={ count }
							type="number"
							onChange={ ( val ) => setAttributes( { count: val } ) }
						/>

					</PanelBody>
				</InspectorControls>
			}
			<div {
				...useBlockProps(
					{ className: classNames(
						'urlslab-block',
						`urlslab-block-${ slug }`,
						'components-placeholder'
					) }
				)
			}>
				<label htmlFor={ inputId } className="components-placeholder__label" >
					<Icon icon={ postComments } />
					{ __( 'FAQs', 'wp-urlslab', 'wp-urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					{ moduleStatus && moduleStatus?.active
						? <strong>{ `[urlslab-faq ${ url ? 'url="' + url + '"' : '' } ${ count ? 'count="' + count + '"' : '' }]` }</strong>
						: moduleStatus
							? <>
								<p>{ __( 'This widget requires FAQs module in URLsLab to be active. If you want to use this widget, activate FAQs module please.', 'wp-urlslab' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate FAQs module', 'wp-urlslab' ) }
									onClick={ ( ) => activateModule( moduleSlug ) }
								/>
							</>
							: <Spinner />
					}
				</div>
			</div>
		</>
	);
};

export default Edit;
