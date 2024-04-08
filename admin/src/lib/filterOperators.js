import { __ } from '@wordpress/i18n';

export const numericOp = {
	'=': __( 'is equal', 'wp-urlslab' ),
	'<>': __( 'is not equal', 'wp-urlslab' ),
	BETWEEN: __( 'is between', 'wp-urlslab' ),
	'>': __( 'is more than', 'wp-urlslab' ),
	'<': __( 'is less than', 'wp-urlslab' ),
};

export const dateOp = {
	'=': __( 'is equal', 'wp-urlslab' ),
	'<>': __( 'is not equal', 'wp-urlslab' ),
	'>': __( 'is after', 'wp-urlslab' ),
	'<': __( 'is before', 'wp-urlslab' ),
};

export const menuOp = {
	'=': __( 'is', 'wp-urlslab' ),
	'<>': __( 'is not', 'wp-urlslab' ),
};

export const browserOp = {
	LIKE: __( 'is', 'wp-urlslab' ),
	NOTLIKE: __( 'is not', 'wp-urlslab' ),
};

export const tagsOp = {
	LIKE: __( 'contains', 'wp-urlslab' ),
	NOTLIKE: __( 'doesn`t contain', 'wp-urlslab' ),
};

export const stringOp = {
	LIKE: __( 'contains', 'wp-urlslab' ),
	NOTLIKE: __( 'doesn`t contain', 'wp-urlslab' ),
	'=': __( 'is equal', 'wp-urlslab' ),
	'<>': __( 'is not', 'wp-urlslab' ),
	'LIKE%': __( 'begins with', 'wp-urlslab' ),
	'NOTLIKE%': __( 'doesn`t begin with', 'wp-urlslab' ),
	'%LIKE': __( 'ends with', 'wp-urlslab' ),
	'NOT%LIKE': __( 'doesn`t end with', 'wp-urlslab' ),
};

export const booleanTypes = {
	Y: __( 'Checked', 'wp-urlslab' ),
	N: __( 'Unchecked', 'wp-urlslab' ),
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
