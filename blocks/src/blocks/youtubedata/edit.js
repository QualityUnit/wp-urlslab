/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, video } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, Button, Spinner } from '@wordpress/components';

import useModules from '../../hooks/useModules';

const slug = 'youtubedata';
const moduleSlug = 'urlslab-lazy-loading';
const moduleName = 'Lazy Loading';

const Edit = ( { attributes, setAttributes } ) => {
	const { videoid, description_length, dataattributes } = attributes;
	const { title, description, thumbnail_url, published_at, duration, captions, captions_text, channel_title } = dataattributes;
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const { moduleStatus, activateModule } = useModules( { moduleSlug } );

	return (
		<>
			{ moduleStatus && moduleStatus?.active &&
			<InspectorControls key="setting">
				<PanelBody
					title={ __( 'Options', 'wp-urlslab' , 'wp-urlslab' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Show thumbnail' , 'wp-urlslab' ) }
						checked={ thumbnail_url }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, thumbnail_url: val } } );
						} }
					/>
					<ToggleControl
						label={ __( 'Show title' , 'wp-urlslab' ) }
						checked={ title }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, title: val } } );
						} }
					/>
					<ToggleControl
						label={ __( 'Show description' , 'wp-urlslab' ) }
						checked={ description }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, description: val } } );
						} }
					/>
					{ description &&
						<TextControl
							label={ __( 'Description length (words, 'wp-urlslab' )', 'wp-urlslab' ) }
							type="number"
							value={ description_length }
							onChange={ ( val ) => setAttributes( { description_length: val } ) }
						/>
					}
					<ToggleControl
						label={ __( 'Show channel title' , 'wp-urlslab' ) }
						checked={ channel_title }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, channel_title: val } } );
						} }
					/>
					<ToggleControl
						label={ __( 'Show published date' , 'wp-urlslab' ) }
						checked={ published_at }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, published_at: val } } );
						} }
					/>
					<ToggleControl
						label={ __( 'Show duration' , 'wp-urlslab' ) }
						checked={ duration }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, duration: val } } );
						} }
					/>

					<ToggleControl
						label={ __( 'Show captions' , 'wp-urlslab' ) }
						checked={ captions }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, captions: val } } );
						} }
					/>
					<ToggleControl
						label={ __( 'Show captions without timestamps' , 'wp-urlslab' ) }
						checked={ captions_text }
						onChange={ ( val ) => {
							setAttributes( { dataattributes: { ...dataattributes, captions_text: val } } );
						} }
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
					<Icon icon={ video } />
					{ __( 'YouTube Data by URLsLab', 'wp-urlslab' , 'wp-urlslab' ) }
				</label>
				<div className="components-placeholder__instructions">{ __( 'Improves page SEO by integrating various data from YouTube video.' , 'wp-urlslab' ) }</div>

				<div className="urlslab-fullwidth-wrapper">
					{ moduleStatus && moduleStatus?.active
						? <TextControl
							id={ inputId }
							label={ __( 'YouTube video ID', 'wp-urlslab' , 'wp-urlslab' ) }
							help={ __( 'YouTube video ID from which data should be taken.', 'wp-urlslab' , 'wp-urlslab' ) }
							type="text"
							value={ videoid }
							placeholder={ __( 'Insert YouTube video ID', 'wp-urlslab' , 'wp-urlslab' ) }
							onChange={ ( val ) => setAttributes( { videoid: val } ) }
							required
						/>
						: moduleStatus
							? <>
								<p>{ __( 'This widget requires' , 'wp-urlslab' ) + ' ' + moduleName + ' ' + __( 'module in URLsLab to be active. If you want to use this widget, activate' , 'wp-urlslab' ) + ' ' + moduleName + ' ' + __( 'module please.' , 'wp-urlslab' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate' , 'wp-urlslab' ) + ' ' + moduleName + ' ' + __( 'module' , 'wp-urlslab' ) }
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
