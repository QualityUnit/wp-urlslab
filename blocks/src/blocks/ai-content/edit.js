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
		} ).then( ( shortcodesData ) => setShortcodes( shortcodesData ) );
	}, [ setShortcodes ] );

	const options = useMemo( () => {
		const filteredShortcodes = shortcodes.filter( ( option ) => {
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

	const handleShortCodeSelect = useCallback( ( shortcodeId ) => {
		const shortcodeObject = shortcodes.filter( ( shortcodeObj ) => shortcodeObj.shortcode_id === shortcodeId )[ 0 ];
		setAttributes( { shortcodeId } );
		setAttributes( { shortcodeObject } );
	}, [ shortcodes, setAttributes ] );

	console.log( attributes.shortcodeObject );

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
							onChange={ ( val ) => setAttributes( { shortcodeVideo: val } ) }
						/>
						{ filteredOptions?.length > 0 &&
							<ComboboxControl
								label={ __( 'Select AI Content Shortcode', 'urlslab' ) }
								value={ attributes.shortcodeId }
								options={
									filteredOptions
								}
								onChange={ handleShortCodeSelect }
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
							<p>{ attributes.shortcodeObject?.prompt }</p>
							<p>{ attributes.shortcodeObject?.shortcode }</p>
						</>
						: moduleStatus
							? <>
								<p>{ __( 'Related Articles module in URLsLab is not activated. If you want to use this widget, activate it please.' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate Related Articles module' ) }
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
