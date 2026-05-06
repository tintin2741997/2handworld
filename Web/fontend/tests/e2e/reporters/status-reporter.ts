import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class StatusReporter implements Reporter {
  private parseMeta(test: TestCase): {
    id: string;
    summary: string;
    expected: string;
    fullTitle: string;
  } {
    const fullTitle = test.titlePath().join(' > ');
    const rawTitle = test.title;
    const idMatch = rawTitle.match(/\[ID:([^\]]+)\]/i);
    const expectMatch = rawTitle.match(/\[EXPECT:([^\]]+)\]/i);
    const summary = rawTitle
      .replace(/\[ID:[^\]]+\]/gi, '')
      .replace(/\[EXPECT:[^\]]+\]/gi, '')
      .trim();

    return {
      id: idMatch?.[1] || 'N/A',
      summary: summary || rawTitle,
      expected: expectMatch?.[1]?.trim() || 'Expected result is defined in assertions',
      fullTitle
    };
  }

  onTestBegin(test: TestCase): void {
    const meta = this.parseMeta(test);
    console.log(`[TEST] ID=${meta.id} | Summary=${meta.summary} | Expect=${meta.expected}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const meta = this.parseMeta(test);
    const actual = result.status === 'passed' ? 'Pass' : 'Failed';

    console.log(
      `[RESULT] ${actual} | ID=${meta.id} | Summary=${meta.summary} | Expect=${meta.expected}`
    );

    if (actual === 'Failed') {
      const reason = result.error?.message?.split('\n')[0]?.trim() || 'Unknown error';
      console.log(`[REASON] ${reason}`);
    }
  }
}

export default StatusReporter;
