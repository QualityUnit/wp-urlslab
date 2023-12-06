/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, image } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button, Spinner } from '@wordpress/components';

import MediaUpload from '../../components/MediaUpload';
import useModules from '../../hooks/useModules';

const slug = 'screenshot';
const moduleSlug = 'urlslab-urls';

const Edit = ( { attributes, setAttributes } ) => {
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const [ reload, setReload ] = useState();
	const { modulesStatus, activateModule } = useModules( reload );

	return (
		<>
			{ modulesStatus && modulesStatus[ moduleSlug ]?.active &&
			<InspectorControls key="setting">
				<PanelBody
					title={ __( 'Options', 'urlslab' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Screenshot type', 'urlslab' ) }
						value={ attributes.screenshotType }
						options={ [
							{ label: __( 'Carousel thumbnail', 'urlslab' ), value: 'carousel-thumbnail' },
							{ label: __( 'Full page thumbnail', 'urlslab' ), value: 'full-page-thumbnail' },
							{ label: __( 'Carousel', 'urlslab' ), value: 'carousel' },
							{ label: __( 'Full page', 'urlslab' ), value: 'full-page' },
						] }
						onChange={ ( val ) => setAttributes( { screenshotType: val } ) }
					/>

					<TextControl
						label={ __( 'Alt text', 'urlslab' ) }
						help={ __( 'Value of the image alt attribute.', 'urlslab' ) }
						value={ attributes.alt }
						onChange={ ( val ) => setAttributes( { alt: val } ) }
					/>

					<TextControl
						label={ __( 'Width', 'urlslab' ) }
						help={ __( 'Insert valid value including unit. e.g. 100%', 'urlslab' ) }
						value={ attributes.width }
						onChange={ ( val ) => setAttributes( { width: val } ) }
					/>

					<TextControl
						label={ __( 'Height', 'urlslab' ) }
						help={ __( 'Insert valid value including unit. e.g. 100%', 'urlslab' ) }
						value={ attributes.height }
						onChange={ ( val ) => setAttributes( { height: val } ) }
					/>

					<MediaUpload
						label={ __( 'Default image', 'urlslab' ) }
						help={ __( 'The URL of default image in case we don\'t have the screenshot yet.', 'urlslab' ) }
						url={ attributes.defaultImage }
						actionCallback={ ( val ) => setAttributes( { defaultImage: val } ) }
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
					<Icon icon={ image } />
					{ __( 'Screenshot', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					{ modulesStatus && modulesStatus[ 'urlslab-urls' ]?.active
						? <TextControl
							id={ inputId }
							label={ __( 'Page url', 'urlslab' ) }
							help={ __( 'Link to the page from which a screenshot should be taken.', 'urlslab' ) }
							type="url"
							value={ attributes.url }
							placeholder={ __( 'Insert website url', 'urlslab' ) }
							onChange={ ( val ) => setAttributes( { url: val } ) }
							required
						/>
						: modulesStatus
							? <>
								<p>{ __( 'This widget requires Link Building module in URLsLab to be active. If you want to use this widget, activate Link Building module please.' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate Link Building module' ) }
									onClick={ ( res ) => activateModule( moduleSlug, setReload( res ) ) }
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
