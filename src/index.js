const { dirname, extname, resolve } = require('path')
const fs = require('fs');

module.exports = ({ types }) => {
    return {
        visitor: {
            ImportDeclaration(declaration, state) {

                const options = Object.assign(
                    {},
                    { ext: 'html?$'},
                    (state && state.opts || {})
                );

                // only interested in files with specific extension
                if (!declaration.node.source.value.match(new RegExp(options.exp))) {
                    return;
                }

                // Import needs a specifier
                if (declaration.node.specifiers && declaration.node.specifiers.length === 0) {
                    throw new Error('No specifiers defined\nAre you missing import <specifier> from "./file.ext"');
                }

                const identifier = declaration.node.specifiers[0].local.name;
                const scriptDirectory = dirname(resolve(state.file.opts.filename))
                const location = resolve(scriptDirectory, declaration.node.source.value);

                try {
                    const content = fs.readFileSync(location, { encoding: 'utf8' });
                    declaration.replaceWithMultiple([
                        types.variableDeclaration('const', [
                            types.variableDeclarator(
                                types.identifier(identifier),
                                types.callExpression(
                                    types.memberExpression(
                                        types.identifier('document'),
                                        types.identifier('createElement'),
                                    ),
                                    [types.stringLiteral('template')]
                                )
                            )
                        ]),
                        types.expressionStatement(
                            types.assignmentExpression(
                                '=',
                                types.memberExpression(
                                    types.identifier(identifier),
                                    types.identifier('innerHTML'),
                                ),
                                types.templateLiteral([
                                    types.templateElement({
                                        raw: content
                                    })
                                ], [])
                            ),
                        )
                    ]);
                } catch (e) {
                    throw new Error(`Can't import ${location}, ${e.message}`);
                }
            }
        }
    }
}