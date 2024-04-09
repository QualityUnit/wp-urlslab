/* eslint-disable no-nested-ternary */
/*global _urlslab_related_articles_block_vars*/
import { useRef } from 'react';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Icon, pages } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, SelectControl, Button, Spinner } from '@wordpress/components';

import useModules from '../../hooks/useModules';

import MediaUpload from '../../components/MediaUpload';

const slug = 'related-articles';
const moduleSlug = 'urlslab-related-resources';

const Edit = ( { attributes, setAttributes } ) => {
	const defaultUrl = useSelect( ( select ) => select( 'core/editor' ).getPermalink(), [] );
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const generalDefaultImageRef = useRef( _urlslab_related_articles_block_vars ? _urlslab_related_articles_block_vars.generalDefaultImage : null );
	const usedGeneralDefaultImage = attributes.defaultImage === '' && generalDefaultImageRef.current;
	const { moduleStatus, activateModule } = useModules( { moduleSlug } );

	return (
		<>
			{ moduleStatus && moduleStatus?.active &&
				<InspectorControls key="setting">
					<PanelBody
						title={ __( 'Options', 'urlslab' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Articles count', 'urlslab' ) }
							help={ __( 'Number of displayed related articles.', 'urlslab' ) }
							type="number"
							min={ 0 }
							value={ attributes.relatedCount }
							onChange={ ( val ) => setAttributes( { relatedCount: val } ) }
						/>

						<ToggleControl
							label={ __( 'Show summary', 'urlslab' ) }
							checked={ attributes.showSummary }
							onChange={ ( val ) => setAttributes( { showSummary: val } ) }
						/>

						<ToggleControl
							label={ __( 'Show image', 'urlslab' ) }
							checked={ attributes.showImage }
							onChange={ ( val ) => setAttributes( { showImage: val } ) }
						/>

						{ attributes.showImage &&
						<>
							<SelectControl
								label={ __( 'Image size', 'urlslab' ) }
								value={ attributes.imageSize }
								options={ [
									{ label: __( 'Carousel thumbnail', 'urlslab' ), value: 'carousel-thumbnail' },
									{ label: __( 'Full page thumbnail', 'urlslab' ), value: 'full-page-thumbnail' },
									{ label: __( 'Carousel', 'urlslab' ), value: 'carousel' },
									{ label: __( 'Full page', 'urlslab' ), value: 'full-page' },
								] }
								onChange={ ( val ) => setAttributes( { imageSize: val } ) }
							/>

							<MediaUpload
								label={ __( 'Default image', 'urlslab' ) }
								help={ usedGeneralDefaultImage ? __( 'Applied is default image from URLsLab Related Articles settings.', 'urlslab' ) : null }
								url={ attributes.defaultImage !== '' ? attributes.defaultImage : generalDefaultImageRef.current }
								actionCallback={ ( val ) => setAttributes( { defaultImage: val } ) }
								showRemoveButton={ ! usedGeneralDefaultImage }
							/>
						</>
						}

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
					<Icon icon={ pages } />
					{ __( 'Related Articles', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					{ moduleStatus && moduleStatus?.active
						? <TextControl
							id={ inputId }
							label={ __( 'Show articles related to url', 'urlslab' ) }
							help={ __( 'Leave empty to use current page url, or type any other internal or external url.', 'urlslab' ) }
							type="url"
							value={ attributes.url }
							placeholder={ defaultUrl }
							onChange={ ( val ) => setAttributes( { url: val } ) }
						/>
						: moduleStatus
							? <>
								<p>{ __( 'Related Articles module in URLsLab is not activated. If you want to use this widget, activate it please.', 'urlslab' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate Related Articles module', 'urlslab' ) }
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
