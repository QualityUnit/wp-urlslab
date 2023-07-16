import React from 'react';
import { __ } from '@wordpress/i18n';

import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { Button } from '../elements/JSXElements';

const PopupToggleButton: React.FC<{ action: () => void }> = ( { action } ) => {
	return <Button className="app-toggle" onClick={ action } active ><StarsIcon />{ __( 'AI Content Assistant' ) }</Button>;
};

export default React.memo( PopupToggleButton );
