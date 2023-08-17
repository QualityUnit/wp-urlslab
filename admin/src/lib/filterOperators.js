
export const numericOp = {
	exactly: 'is exactly',
	'<>': 'is not equal',
	IN: 'is one of',
	NOTIN: 'is not one of',
	BETWEEN: 'is between',
	'>': 'is more than',
	'<': 'is less than',
};

export const dateOp = {
	exactly: 'is exactly',
	'<>': 'is not equal',
	// BETWEEN: 'is between', //Disabled for now
	'>': 'is after',
	'<': 'is before',
};

export const menuOp = {
	exactly: 'is',
	'<>': 'is not',
};

export const langOp = {
	exactly: 'is',
	'<>': 'is not',
	// IN: 'is one of',
};

export const tagsOp = {
	LIKE: 'contains',
	NOTLIKE: 'doesn\'t contain',
};

export const stringOp = {
	LIKE: 'contains',
	NOTLIKE: 'doesn\'t contain',
	exactly: 'is exactly',
	'<>': 'is not',
	'LIKE%': 'begins with',
	'NOTLIKE%': 'doesn\'t begin with',
	'%LIKE': 'ends with',
	'NOT%LIKE': 'doesn\'t end with',
	IN: 'is one of',
	NOTIN: 'is not one of',
	'>': 'is longer than',
	'<': 'is shorter than',
};

export const booleanTypes = {
	true: 'Checked',
	false: 'Unchecked',
};

export const operatorTypes = {
	date: dateOp,
	number: numericOp,
	string: stringOp,
	lang: langOp,
	menu: menuOp,
	boolean: menuOp,
	labels: tagsOp,
};
