const python = require('@lezer/python');
const common = require('@lezer/common');

const parser = python.parser;
const TreeCursor = common.TreeCursor;

/*
 * {
 *	'def': 'FunctionDefinition'
 * }
 *
 * {
 *	'FunctionDefinition': '#abc'
 * }
*/

let tb = parser.parse(`
	def main(s):
		print(f"this is {s}!")
`)

let tc = tb.cursor()
while(tc.next()) {
	console.log(tc.node.type.name)
}




