/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useState, useMemo, useCallback } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, ComboboxControl, Button, Spinner } from '@wordpress/components';

import useModules from '../../hooks/useModules';
import { postFetch } from '../../api';

const slug = 'ai-content';
const moduleSlug = 'urlslab-generator';
const generatorShortcodesSlug = 'generator/shortcode';

const Edit = ( { attributes, setAttributes } ) => {
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const { moduleStatus, activateModule } = useModules( { moduleSlug } );
	const [ shortcodes, setShortcodes ] = useState( [] );
	const [ filteredOptions, setFilteredOptions ] = useState( [] );

	useEffect( () => {
		postFetch( generatorShortcodesSlug, { sorting: [ { dir: 'ASC' } ], filters: [], rows_per_page: 500 } ).then( ( response ) => {
			if ( response.ok ) {
				return response.json();
			}
		} ).then( ( shortcodesData ) => {
			setShortcodes( shortcodesData );
			setAttributes( { shortcodeObject: shortcodesData.filter( ( shortcodeObj ) => Number( shortcodeObj.shortcode_id ) === attributes.shortcodeId )[ 0 ] } );
		} );
	}, [ attributes.shortcodeId, setAttributes ] );

	useEffect( () => {
		if ( filteredOptions.length && ! Object.keys( attributes.shortcodeObject || {} )?.length ) {
			setAttributes( { shortcodeId: filteredOptions[ 0 ]?.value } );
		}
	}, [ filteredOptions, attributes.shortcodeObject, setAttributes ] );

	const options = useMemo( () => {
		const filteredShortcodes = shortcodes?.filter( ( option ) => {
			if ( attributes.shortcodeVideo ) {
				return option.shortcode_type === 'V';
			}
			return option.shortcode_type === 'S';
		} )
			.map( ( shortcode ) => ( {
				label: shortcode.shortcode_name, value: shortcode.shortcode_id,
			} ) );

		setFilteredOptions( filteredShortcodes );
		return filteredShortcodes;
	}, [ attributes.shortcodeVideo, shortcodes ] );

	const handleShortCodeSelect = useCallback( ( val ) => {
		const shortcodeObject = shortcodes.filter( ( shortcodeObj ) => Number( shortcodeObj.shortcode_id ) === val )[ 0 ];
		setAttributes( { shortcodeId: val } );
		setAttributes( { shortcodeObject } );
	}, [ shortcodes, setAttributes ] );

	return (
		<>
			{ moduleStatus && moduleStatus?.active &&
				<InspectorControls key="setting">
					<PanelBody
						title={ __( 'AI Content Options', 'urlslab' ) }
						initialOpen={ true }
					>
						<ToggleControl
							label={ __( 'Is Video Content', 'urlslab' ) }
							checked={ attributes.shortcodeVideo }
							onChange={ ( val ) => {
								setAttributes( { shortcodeObject: {} } );
								setAttributes( { shortcodeVideo: val } );
								setAttributes( { shortcodeVideoId: '' } );
							} }
						/>
						{ filteredOptions?.length > 0 &&
							<ComboboxControl
								label={ __( 'Select AI Content Shortcode', 'urlslab' ) }
								value={ attributes.shortcodeId }
								options={
									filteredOptions
								}
								onChange={ ( val ) => handleShortCodeSelect( val ) }
								onFilterValueChange={ ( inputValue ) =>
									setFilteredOptions(
										options.filter( ( option ) =>
											option.label
												.toLowerCase()
												.startsWith( inputValue.toLowerCase() )
										)
									)
								}
							/>
						}
						{
							attributes.shortcodeVideo &&
							<TextControl
								label={ __( 'Video ID', 'urlslab' ) }
								help={ __( 'Insert valid ID of YouTube video', 'urlslab' ) }
								value={ attributes.shortcodeVideoId }
								onChange={ ( val ) => setAttributes( { shortcodeVideoId: val } ) }
							/>
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
					{ __( 'AI Content', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					{ moduleStatus && moduleStatus?.active
						? Object.keys( attributes.shortcodeObject || {} ).length > 0 &&
						<>
							<p><strong>{ __( 'Shortcode inserted:' ) }</strong></p>
							<div>
								{ attributes.shortcodeVideo
									? attributes.shortcodeVideoId ? <strong>[urlslab-generator id="{ attributes.shortcodeId }"  videoid="{ attributes.shortcodeVideoId }"]</strong> : <strong className="error">{ __( 'Video ID is not entered!!!' ) }</strong>
									: <strong>[urlslab-generator id="{ attributes.shortcodeId }"]</strong>
								}
							</div>

							<p><strong>{ __( 'AI Content Prompt:' ) }</strong></p>
							<div>
								<code>{ attributes.shortcodeObject?.prompt }</code>
							</div>
						</>
						: moduleStatus
							? <>
								<p>{ __( 'AI Content module in URLsLab is not activated. If you want to use this widget, activate it please.' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate AI Content module' ) }
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
