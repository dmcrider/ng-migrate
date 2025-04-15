export interface NgModuleMetadata {
    moduleName: string;
    filePath: string;
    declarations: string[];
    imports: string[];
    exports: string[];
    bootstrap: string[];
    migrationCandidate: boolean;
}