import { Codemod } from "src/types/codemod";

export const replaceRenderer: Codemod = {
    name: 'replace-renderer',
    versionRange: [12, 13],
    run(file, project){
        const classes = file.getClasses();
        for(const cls of classes){
            const ctors = cls.getConstructors();
            for(const ctor of ctors){
                ctor.getParameters().forEach(param => {
                    const type = param.getType().getText();
                    if(type === 'Renderer'){
                        param.replaceWithText('Renderer2');
                        file.addImportDeclaration({
                            moduleSpecifier: '@angular/core',
                            namedImports: ['Renderer2'],
                        });
                    }
                });
            }
        }
    }
};