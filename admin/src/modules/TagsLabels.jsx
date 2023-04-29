import { useMemo, useState, Suspense, lazy } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import Tags from '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/src/tagify.scss';

import Tag from '../elements/Tag';
import Tooltip from '../elements/Tooltip';

import '../assets/styles/layouts/_Settings.scss';
import ColorPicker from '../components/ColorPicker';

export default function TagsLabels( ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	const createdTags = useMemo( () => {
		return queryClient.getQueryData( [ 'tags' ] );
	}, [ queryClient ] );

	const possibleModules = useMemo( () => {
		return queryClient.getQueryData( [ 'tags', 'modules' ] );
	}, [ queryClient ] );

	const options = {
		whitelist: createdTags,
		tagTextProp: 'name',
	};

	return (
		<Suspense>
			<section className="urlslab-settingsPanel-section">
				<div className="urlslab-settingsPanel urlslab-panel flex-tablet-landscape">
					<ul className="urlslab-tags" key="tags">
						{
							createdTags.map( ( tag ) => {
								const { label_id, bgcolor, name, modules } = tag;
								return <li key={ label_id }><Tag style={ { backgroundColor: bgcolor } }>{ name }</Tag></li>;
							} )
						}
					</ul>
					<ColorPicker onChange={ ( color ) => console.log( color ) } />
				</div>
			</section>
		</Suspense>
	);
}
