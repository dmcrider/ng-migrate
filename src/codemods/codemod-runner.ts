import { Project } from 'ts-morph';
import { getCodemodsForRange } from './registry.js';
import { log } from '../core/logger.js';

function printCodemodStatus(index: number, total: number, name: string, status: 'applying' | 'applied' | 'failed'){
    const statusMap = {
        applying: '🔄 Applying',
        applied: '✅ Applied',
        failed: '❌ Failed to apply'
    };
    process.stdout.write(`\r${statusMap[status]} ${index + 1} of ${total}: ${name}`);
    if(status !== 'applying') process.stdout.write('\n');
}

export async function runCodemods(current: number, target: number, dryRun = false) {
    const project = new Project({
        tsConfigFilePath: './tsconfig.json',
        skipAddingFilesFromTsConfig: false
    });

    const codemods = getCodemodsForRange(current, target);
    const sourceFiles = project.getSourceFiles(['src/**/*.ts']);

    if(codemods.length === 0) {
        log.info(`No codemods to apply for Angular ${current} → ${target}.`);
        return;
    }

    log.info(`Found ${codemods.length} codemods to apply for Angular ${current} → ${target}.`);

    for (const file of sourceFiles) {
        for(let i = 0; i < codemods.length; i++){
            const codemod = codemods[i];
            try {
                printCodemodStatus(i, codemods.length, codemod.name, 'applying');
                codemod.run(file, project);
                printCodemodStatus(i, codemods.length, codemod.name, 'applied');
            } catch (error) {
                printCodemodStatus(i, codemods.length, codemod.name, 'failed');
                log.warn(`Failed to apply ${codemod.name} to ${file.getBaseName()}: ${error}`);
            }
        }
    }

    if (!dryRun) {
        await project.save();
        log.success(`${codemods.length} codemods applied successfully.`);
    } else {
        log.info('Dry-run mode: changes not saved.');
    }

    // Optional cleanup logic
    for (const codemod of codemods) {
        if(typeof codemod.afterAll === 'function') {
            try {
                await codemod.afterAll();
            } catch (error) {
                log.warn(`Failed to run afterAll for ${codemod.name}: ${error}`);
            }
        }
    }
}
