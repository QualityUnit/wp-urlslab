import { __ } from '@wordpress/i18n';
import { MediaUpload as WpMediaUpload } from '@wordpress/block-editor';
import { Button, BaseControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

const MediaUpload = ( { url, actionCallback, label, help, showRemoveButton = true } ) => {
	const instanceId = useInstanceId( MediaUpload );
	return (
		<>
			<BaseControl
				id={ `urlslab-media-upload-${ instanceId }` }
				className="urlslab-media-upload"
				label={ label || null }
				help={ help || null }
			>
				<WpMediaUpload
					label={ 'test' }
					onSelect={ ( media ) => {
						actionCallback( media.url );
					} }
					allowedTypes={ [ 'image' ] }
					value={ url }
					render={ ( { open } ) => (
						url === ''
							? <div className="urlslab-media-upload-placeholder">
								<Button
									variant="primary"
									onClick={ open }
									isSmall
								>
									{ __( 'Select image', 'urlslab' ) }
								</Button>
							</div>
							: <div className="urlslab-media-upload-controls">
								<div className="image-preview" role="button">
									<img role="presentation" src={ url } alt="" onClick={ open } />
								</div>
								<div className="buttons-wrapper">
									<Button
										variant="primary"
										onClick={ open }
										isSmall
									>
										{ __( 'Change', 'urlslab' ) }
									</Button>
									{ showRemoveButton &&
									<Button
										variant="tertiary"
										onClick={ () => {
											actionCallback( '' );
										} }
										isSmall
									>
										{ __( 'Remove', 'urlslab' ) }
									</Button>
									}
								</div>
							</div>
					) }
				/>
			</BaseControl>
		</>
	);
};

export default MediaUpload;
