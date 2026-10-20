import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Collapsible } from "radix-ui";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/utils", () => import("../src/lib/utils"));

import { MinimalButton } from "../src/components/evil-buttons/minimal";

const render = renderToStaticMarkup;

describe("MinimalButton", () => {
  it("preserves native button attributes and supports submit actions", () => {
    const html = render(
      <MinimalButton disabled aria-label="Save changes" data-action="save" arrow={false}>
        Save
      </MinimalButton>,
    );

    expect(html).toContain('type="button"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-label="Save changes"');
    expect(html).toContain('data-action="save"');
    expect(html).not.toContain("<svg");
    expect(render(<MinimalButton type="submit">Submit</MinimalButton>)).toContain('type="submit"');
  });

  it("composes a single accessible Radix trigger without wrapping block content", () => {
    const html = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger asChild>
          <MinimalButton arrow={false}><div>Role details</div></MinimalButton>
        </Collapsible.Trigger>
        <Collapsible.Content>Details</Collapsible.Content>
      </Collapsible.Root>,
    );

    expect(html.match(/<button\b/g)).toHaveLength(1);
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-controls="');
    expect(html).toContain("><div>Role details</div></button>");
  });
});
