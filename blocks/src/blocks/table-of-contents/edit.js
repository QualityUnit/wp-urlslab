import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, image } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect } from 'react';

const slug = 'table-of-contents';

const Edit = ( { attributes, setAttributes } ) => {
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;

	const headerBlocks = useSelect(
		( select ) => select( 'core/editor' ).getBlocks(),
		[]
	).filter( ( block ) => block.name === 'core/heading' );

	const headerTypes = headerBlocks.reduce( ( obj, h ) => ( { ...obj, [ `${ h.attributes.level }` ]: `H${ h.attributes.level }` } ), {} );

	console.log( attributes );
	useEffect( () => {
		setAttributes( { headersMaxLevel: 2 } );
	}, [ setAttributes ] );

	const handleHeaders = ( headersMaxLevel ) => {
		setAttributes( { headersMaxLevel: Number( headersMaxLevel ) } );
		setAttributes( { headers: headerBlocks.filter( ( block ) => block.attributes.level <= headersMaxLevel ) } );
	};

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody
					title={ __( 'Options', 'urlslab' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Headings up to:', 'urlslab' ) }
						value={ attributes.headersMaxLevel }
						options={
							Object.entries( headerTypes ).map( ( [ value, label ] ) => {
								return { label, value };
							} )
						}
						onChange={ handleHeaders }
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
					{ __( 'Table of Contents', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					<ul>
						{
							headerBlocks.map( ( header ) => {
								const { anchor, content, level } = header.attributes;
								return level <= ( attributes?.headersMaxLevel || 6 ) && <li key={ header.clientId } id={ anchor }>{ content }</li>;
							} )
						}
					</ul>
				</div>
			</div>
		</>
	);
};

export default Edit;
