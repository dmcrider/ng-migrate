import { Codemod } from 'src/types/codemod';
import fs from 'fs';

export const removeViewEngineConfig: Codemod = {
    name: 'remove-viewengine-config',
    versionRange: [12, 13],
    run: (_, __) => {
        const tsConfigPaths = ['tsconfig.app.json', 'tsconfig.json', 'angular.json'];

        for (const path of tsConfigPaths) {
        if (!fs.existsSync(path)) continue;

        const content = fs.readFileSync(path, 'utf8');
        let updated = content;

        // Remove enableIvy: false
        updated = updated.replace(/"enableIvy"\s*:\s*false,?/, '');

        // Remove aot: false
        updated = updated.replace(/"aot"\s*:\s*false,?/, '');

        // Remove enableLegacyTemplate: true
        updated = updated.replace(/"enableLegacyTemplate"\s*:\s*true,?/, '');

        if (updated !== content) {
            fs.writeFileSync(path, updated, 'utf8');
            console.log(`🔧 Removed deprecated ViewEngine config from ${path}`);
        }
        }
    }
};
