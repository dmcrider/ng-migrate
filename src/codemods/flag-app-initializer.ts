import { Codemod } from 'src/types/codemod';
import { SyntaxKind } from 'ts-morph';

export const flagAppInitializer: Codemod = {
    name: 'flag-app-initializer',
    versionRange: [12, 13],
    run(file, _) {
        const identifiers = file.getDescendantsOfKind(SyntaxKind.Identifier);
        identifiers.forEach(id => {
        if (id.getText() === 'APP_INITIALIZER') {
            const line = id.getStartLineNumber();
            const comment = `// ⚠️ APP_INITIALIZER found. Review for migration compatibility`;
            file.insertText(id.getStartLinePos(), comment + '\n');
            console.log(`⚠️ Flagged APP_INITIALIZER in ${file.getFilePath()} (line ${line})`);
        }
        });
    }
};
