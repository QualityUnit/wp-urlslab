
export const numericOp = {
	'=': 'is equal',
	'<>': 'is not equal',
	BETWEEN: 'is between',
	'>': 'is more than',
	'<': 'is less than',
};

export const dateOp = {
	'=': 'is equal',
	'<>': 'is not equal',
	'>': 'is after',
	'<': 'is before',
};

export const menuOp = {
	'=': 'is',
	'<>': 'is not',
};

export const langOp = {
	'=': 'is',
	'<>': 'is not',
};

export const countryOp = {
	'=': 'is',
	'<>': 'is not',
};

export const browserOp = {
	LIKE: 'is',
	NOTLIKE: 'is not',
};

export const tagsOp = {
	LIKE: 'contains',
	NOTLIKE: 'doesn\'t contain',
};

export const stringOp = {
	LIKE: 'contains',
	NOTLIKE: 'doesn\'t contain',
	'=': 'is equal',
	'<>': 'is not',
	'LIKE%': 'begins with',
	'NOTLIKE%': 'doesn\'t begin with',
	'%LIKE': 'ends with',
	'NOT%LIKE': 'doesn\'t end with',
};

export const booleanTypes = {
	Y: 'Checked',
	N: 'Unchecked',
};

export const operatorTypes = {
	date: dateOp,
	number: numericOp,
	string: stringOp,
	lang: langOp,
	browser: browserOp,
	country: countryOp,
	menu: menuOp,
	boolean: menuOp,
	labels: tagsOp,
};
