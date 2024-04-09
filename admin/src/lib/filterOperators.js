import { __ } from '@wordpress/i18n';

export const numericOp = {
	'=': __( 'is equal', 'urlslab' ),
	'<>': __( 'is not equal', 'urlslab' ),
	BETWEEN: __( 'is between', 'urlslab' ),
	'>': __( 'is more than', 'urlslab' ),
	'<': __( 'is less than', 'urlslab' ),
};

export const dateOp = {
	'=': __( 'is equal', 'urlslab' ),
	'<>': __( 'is not equal', 'urlslab' ),
	'>': __( 'is after', 'urlslab' ),
	'<': __( 'is before', 'urlslab' ),
};

export const menuOp = {
	'=': __( 'is', 'urlslab' ),
	'<>': __( 'is not', 'urlslab' ),
};

export const browserOp = {
	LIKE: __( 'is', 'urlslab' ),
	NOTLIKE: __( 'is not', 'urlslab' ),
};

export const tagsOp = {
	LIKE: __( 'contains', 'urlslab' ),
	NOTLIKE: __( 'doesn`t contain', 'urlslab' ),
};

export const stringOp = {
	LIKE: __( 'contains', 'urlslab' ),
	NOTLIKE: __( 'doesn`t contain', 'urlslab' ),
	'=': __( 'is equal', 'urlslab' ),
	'<>': __( 'is not', 'urlslab' ),
	'LIKE%': __( 'begins with', 'urlslab' ),
	'NOTLIKE%': __( 'doesn`t begin with', 'urlslab' ),
	'%LIKE': __( 'ends with', 'urlslab' ),
	'NOT%LIKE': __( 'doesn`t end with', 'urlslab' ),
};

export const booleanTypes = {
	Y: __( 'Checked', 'urlslab' ),
	N: __( 'Unchecked', 'urlslab' ),
};

export const operatorTypes = {
	date: dateOp,
	number: numericOp,
	string: stringOp,
	lang: menuOp,
	browser: menuOp,
	country: menuOp,
	roles: menuOp,
	capabilities: menuOp,
	postTypes: menuOp,
	menu: menuOp,
	boolean: menuOp,
	labels: tagsOp,
};
