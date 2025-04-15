export interface NgModuleRecord {
    moduleName: string;
    filePath: string;
    declarations: string[];
    migrationCandidate: boolean;
}