import { Codemod } from 'src/types/codemod';
import fs from 'fs';
import path from 'path';
import { NgModuleRecord } from 'src/types/ngMOduleRecord';
import { SyntaxKind } from 'ts-morph';



let migrationMap: NgModuleRecord[] = [];

export const convertToStandalone: Codemod = {
    name: 'convert-to-standalone',
    versionRange: [15, 17],

    run(file, project) {
        const filePath = file.getFilePath();
        const match = migrationMap.find(m => path.resolve(m.filePath) === path.resolve(filePath));
        if (!match || !match.migrationCandidate) return;

        const componentName = match.declarations[0];
        const componentClass = file.getClass(componentName);
        const decorator = componentClass?.getDecorator('Component');

        if (!decorator) return;

        // 🔧 Modify the decorator object to include standalone: true
        const arg = decorator.getArguments()[0];
        if (arg && arg.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const obj = arg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
        if (!obj.getProperty('standalone')) {
            obj.addPropertyAssignment({
            name: 'standalone',
            initializer: 'true'
            });
        }
        }

        // 🔧 Remove the NgModule declaration if it exists in the same file
        const classes = file.getClasses();
        classes.forEach(cls => {
        if (cls.getDecorator('NgModule')) {
            cls.remove();
        }
        });

        // ✅ Ensure `Component` and `standalone` is imported from `@angular/core`
        const importDecl = file.getImportDeclaration('@angular/core');
        if (importDecl) {
        const named = importDecl.getNamedImports().map(i => i.getName());
        if (!named.includes('Component')) importDecl.addNamedImport('Component');
        } else {
        file.addImportDeclaration({
            moduleSpecifier: '@angular/core',
            namedImports: ['Component']
        });
        }

        console.log(`✅ Converted ${componentName} to standalone in ${filePath}`);
    },

    beforeAll() {
        const pathToJson = path.resolve('codemods/ngmodule-usage.json');
        if (fs.existsSync(pathToJson)) {
        migrationMap = JSON.parse(fs.readFileSync(pathToJson, 'utf8'));
        }
    }
};
