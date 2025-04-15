import { SourceFile, Project } from 'ts-morph';

export interface Codemod {
    name: string;
    versionRange: [number, number];
    run: (file: SourceFile, project: Project) => void;
    beforeAll?: () => void;
    afterAll?: () => Promise<void>;
}