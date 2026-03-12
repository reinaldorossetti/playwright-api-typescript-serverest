import type { TestInfo } from '@playwright/test';

const ALLOWED_SEVERITIES = ['blocker', 'critical', 'normal', 'minor', 'trivial'] as const;
export type AllureSeverity = (typeof ALLOWED_SEVERITIES)[number];

export type AnnotationOptions = {
  severity: AllureSeverity;
  tags?: string[];
};

export function annotateTest(testInfo: TestInfo, { severity, tags = [] }: AnnotationOptions): void {
  if (!ALLOWED_SEVERITIES.includes(severity)) {
    throw new Error(`Invalid Allure severity provided: ${severity}`);
  }

  testInfo.annotations.push({ type: 'severity', description: severity });

  for (const tag of tags) {
    testInfo.annotations.push({ type: 'tag', description: tag });
  }
}
