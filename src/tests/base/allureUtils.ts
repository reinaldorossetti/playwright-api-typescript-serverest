import { Severity, severity, tag } from 'allure-js-commons';

/**
 * Sets the Allure severity label and one or more tags for the current test.
 * Extracted from duplicated inline definitions across spec files.
 */
export const setSeverityAndTags = async (sev: Severity, tags: string[] = []): Promise<void> => {
    await severity(sev);
    for (const t of tags) {
        await tag(t);
    }
};
