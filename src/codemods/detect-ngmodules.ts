import { Codemod } from 'src/types/codemod';
import { SyntaxKind, Decorator, ObjectLiteralExpression } from 'ts-morph';
import fs from 'fs';
import path from 'path';
import { NgModuleMetadata } from 'src/types/ngModuleMetadata';

const ngModules: NgModuleMetadata[] = [];

export const detectNgModules: Codemod = {
    name: 'detect-ngmodules',
    versionRange: [14, 16],

    run(file, _) {
        const classes = file.getClasses();

        for (const cls of classes) {
            const ngDecorator = cls.getDecorator('NgModule');
            if (!ngDecorator) continue;

            const moduleName = cls.getName() || 'UnnamedModule';
            const filePath = file.getFilePath();
            const metadata = extractNgModuleMetadata(ngDecorator);

            const record: NgModuleMetadata = {
                moduleName,
                filePath,
                declarations: metadata.declarations,
                imports: metadata.imports,
                exports: metadata.exports,
                bootstrap: metadata.bootstrap,
                migrationCandidate: false
            };

            ngModules.push(record);

            // 📜 Terminal summary
            console.log(`📦 Found NgModule: ${moduleName}`);
            if (metadata.declarations.length > 0){
                console.log(`  └─ Declarations: ${metadata.declarations.join(', ')}`);
            }
            if (metadata.imports.length > 0){
                console.log(`  └─ Imports:      ${metadata.imports.join(', ')}`);
            }
            if (metadata.bootstrap.length > 0){
                console.log(`  └─ Bootstraps:   ${metadata.bootstrap.join(', ')}`);
            }

            // 🚩 Standalone Migration Candidate
            const hasOnlyOneDeclaration = metadata.declarations.length === 1;
            const isMinimal = metadata.imports.length === 0 && metadata.exports.length === 0 && metadata.bootstrap.length === 0;
            const isAppModule = moduleName.toLowerCase() === 'appmodule';

            if (!isAppModule && hasOnlyOneDeclaration && isMinimal) {
                record.migrationCandidate = true;
                console.log(`  ✅ Marked as standalone migration candidate`);
            }
        }
    },

    // Optional cleanup logic
    async afterAll() {
        const outPath = path.join('codemods', 'ngmodule-usage.json');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(ngModules, null, 2), 'utf-8');
        console.log(`🗂️ NgModule analysis saved to ${outPath}`);
    }
    };

    function extractNgModuleMetadata(decorator: Decorator): {
    declarations: string[];
    imports: string[];
    exports: string[];
    bootstrap: string[];
    } {
    const args = decorator.getArguments();
    const obj = args[0] as ObjectLiteralExpression;
    const metadata = {
        declarations: [] as string[],
        imports: [] as string[],
        exports: [] as string[],
        bootstrap: [] as string[]
    };

    if (!obj || !obj.getProperties) return metadata;

    obj.getProperties().forEach(prop => {
        if (!prop || !('getName' in prop)) return;

        const name = prop.getName();
        const arr = (prop as any).getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        if (!arr) return;

        const values = arr.getElements().map((e: { getText: () => string; }) => e.getText().trim()).filter(Boolean);

        if (name === 'declarations') metadata.declarations = values;
        else if (name === 'imports') metadata.imports = values;
        else if (name === 'exports') metadata.exports = values;
        else if (name === 'bootstrap') metadata.bootstrap = values;
    });

    return metadata;
}
