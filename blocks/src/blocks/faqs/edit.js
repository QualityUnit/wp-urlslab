/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Icon, postComments } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Spinner } from '@wordpress/components';

import useModules from '../../hooks/useModules';

const slug = 'faqs';
const moduleSlug = 'urlslab-faq';

const Edit = ( ) => {
	const instanceId = useInstanceId( Edit );
	const inputId = `urlslab-${ slug }-input-${ instanceId }`;
	const { moduleStatus, activateModule } = useModules( { moduleSlug } );

	return (
		<>
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
					<Icon icon={ postComments } />
					{ __( 'FAQs', 'urlslab' ) }
				</label>

				<div className="urlslab-fullwidth-wrapper">
					{ moduleStatus && moduleStatus?.active
						? <strong>{ '[urlslab-faq]' }</strong>
						: moduleStatus
							? <>
								<p>{ __( 'This widget requires FAQs module in URLsLab to be active. If you want to use this widget, activate FAQs module please.' ) }</p>
								<Button variant="primary"
									text={ __( 'Activate FAQs module' ) }
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
