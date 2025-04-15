import { Codemod } from 'src/types/codemod';
import { SyntaxKind } from 'ts-morph';

const formClasses = ['FormControl', 'FormGroup', 'FormArray'];

export const convertTypedForms: Codemod = {
    name: 'convert-typed-forms',
    versionRange: [13, 14],
    run(file, _) {
        const updated: Set<string> = new Set();

        file.getDescendantsOfKind(SyntaxKind.NewExpression).forEach(expr => {
        const className = expr.getExpression().getText();
        if (formClasses.includes(className) && expr.getTypeArguments().length === 0) {
            expr.addTypeArgument('any');
            updated.add(className);
        }
        });

        if (updated.size > 0) {
        const imports = Array.from(updated);
        const hasImport = file.getImportDeclaration(d =>
            d.getModuleSpecifierValue() === '@angular/forms'
        );

        if (hasImport) {
            const namedImports = hasImport.getNamedImports().map(n => n.getName());
            imports.forEach(name => {
            if (!namedImports.includes(name)) {
                hasImport.addNamedImport(name);
            }
            });
        } else {
            file.addImportDeclaration({
            moduleSpecifier: '@angular/forms',
            namedImports: imports
            });
        }
        }
    }
};
