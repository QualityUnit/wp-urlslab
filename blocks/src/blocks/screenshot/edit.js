import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, image } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

import MediaUpload from '../../components/MediaUpload';

const slug = 'screenshot';

const Edit = ( { attributes, setAttributes } ) => {
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;

	return (
		<>
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

					width

					height

					<MediaUpload
						label={ __( 'Default image', 'urlslab' ) }
						help={ __( 'The URL of the default image in case we don\'t yet have the screenshot.', 'urlslab' ) }
						url={ attributes.defaultImage }
						actionCallback={ ( val ) => setAttributes( { defaultImage: val } ) }
					/>

				</PanelBody>
			</InspectorControls>

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
					<TextControl
						id={ inputId }
						label={ __( 'Page url', 'urlslab' ) }
						help={ __( 'Link to the page from which a screenshot should be taken.', 'urlslab' ) }
						type="url"
						value={ attributes.url }
						placeholder={ __( 'Insert website url', 'urlslab' ) }
						onChange={ ( val ) => setAttributes( { url: val } ) }
						required
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;
