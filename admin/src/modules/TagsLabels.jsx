import { useMemo, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';

import Tag from '../elements/Tag';

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

	return (
		<Suspense>
			<section className="urlslab-settingsPanel-section">
				<div className="urlslab-settingsPanel urlslab-panel flex-tablet-landscape">
					<ul className="urlslab-tags" key="tags">
						{
							createdTags.map( ( tag ) => {
								const { label_id, bgcolor, name, className, modules } = tag;
								return <li key={ label_id }><Tag className={ `${ className || '' }` } style={ { backgroundColor: bgcolor } }>{ name }</Tag></li>;
							} )
						}
					</ul>
					<ColorPicker onChange={ ( color ) => console.log( color ) } />
				</div>
			</section>
		</Suspense>
	);
}
