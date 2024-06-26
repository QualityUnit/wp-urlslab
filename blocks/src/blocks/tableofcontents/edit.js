import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { Icon, title } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

const slug = 'tableofcontents';

const Edit = ( { attributes, setAttributes } ) => {
	const postHeaders = useSelect(
		( select ) => select( 'core/editor' ).getBlocks(),
		[]
	).filter( ( block ) => block.name === 'core/heading' );

	const minimumLevel = postHeaders.reduce( ( level, h ) => ( level < h.attributes.level ? level : h.attributes.level ) );

	const headerBlocks = useMemo( () => {
		let hBlocks = [];

		hBlocks = postHeaders.flatMap( ( header ) => {
			const { anchor, content, level } = header.attributes;
			return [ ...hBlocks, { anchor, content, level, clientId: header.clientId } ];
		} );

		const blocks = [ [ hBlocks[ 0 ] ] ];

		for ( const item of hBlocks.slice( 1 ) ) {
			if ( item.level === minimumLevel ) {
				blocks.push( [] );
			}
			blocks[ blocks.length - 1 ].push( item );
		}

		return blocks;
	}, [ postHeaders, minimumLevel ] );

	const headerTypes = postHeaders.reduce( ( obj, h ) => ( { ...obj, [ `${ h.attributes.level }` ]: `H${ h.attributes.level }` } ), {} );

	useEffect( () => {
		setAttributes( { headers: JSON.stringify( headerBlocks ) } );
		setAttributes( { minimumLevel } );
	}, [ setAttributes, minimumLevel, headerBlocks ] );

	const handleHeaders = ( headersMaxLevel ) => {
		setAttributes( { headersMaxLevel: Number( headersMaxLevel ) } );
	};

	const InnerList = ( { items } ) => {
		return <ul className={ `urlslab-block-${ slug }-subList` }>
			{
				items.map( ( item ) => {
					return <li className={ `urlslab-block-${ slug }-${ item.level }` } key={ item.clientId } id={ item.anchor }>
						{ item.content }
					</li>;
				} )
			}
		</ul>;
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
				<label className="components-placeholder__label" >
					<Icon icon={ title } />
					{ __( 'Table of Contents', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					<ul className={ `urlslab-block-${ slug }-list` }>
						{
							headerBlocks.map( ( itemsArr ) => {
								const arrayCopy = [ ...itemsArr ];
								const firstItem = arrayCopy.shift();
								const { anchor, content, clientId } = firstItem;
								return <li key={ clientId } id={ anchor }>
									{ typeof content === 'string' ? content : content?.originalHTML }
									{ arrayCopy?.length && minimumLevel < attributes.headersMaxLevel
										? <InnerList items={ arrayCopy } />
										: null
									}
								</li>;
							} )
						}
					</ul>
				</div>
			</div>
		</>
	);
};

export default Edit;
