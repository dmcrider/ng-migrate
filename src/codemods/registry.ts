import { Codemod } from "src/types/codemod";
import { replaceRenderer } from "./replace-renderer";
import { removeViewEngineConfig } from "./remove-viewengine-config";
import { flagAppInitializer } from "./flag-app-initializer";
import { convertTypedForms } from "./convert-typed-forms";
import { convertToStandalone } from "./convert-to-standalone";

export const codemodRegistry: Codemod[] = [
    replaceRenderer,
    removeViewEngineConfig,
    flagAppInitializer,
    convertTypedForms,
    convertToStandalone
];

export function getCodemodsForRange(current: number, target: number): Codemod[] {
    return codemodRegistry.filter(codemod => 
        codemod.versionRange[0] >= current && codemod.versionRange[1] <= target
    );
}