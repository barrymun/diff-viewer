import type { StructuredPatchHunk } from "diff";
import { describe, expect, it } from "vitest";

import { alignHunkLines, collectContiguousChanges } from "./helpers";

describe(collectContiguousChanges.name, () => {
  it("collects only deletions", () => {
    const lines = ["-line 1", "-line 2", " line 3"];
    const [removals, additions] = collectContiguousChanges(lines, 0);
    expect(removals).toEqual(["line 1", "line 2"]);
    expect(additions).toEqual([]);
  });

  it("collects only additions", () => {
    const lines = ["+line A", "+line B", " line C"];
    const [removals, additions] = collectContiguousChanges(lines, 0);
    expect(removals).toEqual([]);
    expect(additions).toEqual(["line A", "line B"]);
  });

  it("collects mixed deletions and additions", () => {
    const lines = ["-old 1", "-old 2", "+new 1", "+new 2", " line x"];
    const [removals, additions] = collectContiguousChanges(lines, 0);
    expect(removals).toEqual(["old 1", "old 2"]);
    expect(additions).toEqual(["new 1", "new 2"]);
  });

  it("stops at first unchanged line", () => {
    const lines = ["-old", " line", "+new"];
    const [removals, additions] = collectContiguousChanges(lines, 0);
    expect(removals).toEqual(["old"]);
    expect(additions).toEqual([]);
  });

  it("returns empty arrays when starting on unchanged line", () => {
    const lines = [" line 1", "-removed", "+added"];
    const [removals, additions] = collectContiguousChanges(lines, 0);
    expect(removals).toEqual([]);
    expect(additions).toEqual([]);
  });

  it("handles starting in the middle of changes", () => {
    const lines = ["-a", "-b", "+x", "+y", " line z"];
    const [removals, additions] = collectContiguousChanges(lines, 2);
    expect(removals).toEqual([]);
    expect(additions).toEqual(["x", "y"]);
  });
});

describe(alignHunkLines.name, () => {
  it("aligns unchanged lines", () => {
    const hunk: StructuredPatchHunk = {
      oldStart: 1,
      newStart: 1,
      oldLines: 2,
      newLines: 2,
      lines: [" line one", " line two"],
    };

    expect(alignHunkLines(hunk)).toEqual([
      {
        oldLineNumber: 1,
        oldLine: "line one",
        newLineNumber: 1,
        newLine: "line one",
      },
      {
        oldLineNumber: 2,
        oldLine: "line two",
        newLineNumber: 2,
        newLine: "line two",
      },
    ]);
  });

  it("aligns pure deletions", () => {
    const hunk: StructuredPatchHunk = {
      oldStart: 3,
      newStart: 3,
      oldLines: 2,
      newLines: 0,
      lines: ["-  old line 1", "-  old line 2"],
    };

    expect(alignHunkLines(hunk)).toEqual([
      {
        oldLineNumber: 3,
        oldLine: "  old line 1",
        newLineNumber: undefined,
        newLine: undefined,
      },
      {
        oldLineNumber: 4,
        oldLine: "  old line 2",
        newLineNumber: undefined,
        newLine: undefined,
      },
    ]);
  });

  it("aligns pure additions", () => {
    const hunk: StructuredPatchHunk = {
      oldStart: 5,
      newStart: 5,
      oldLines: 0,
      newLines: 2,
      lines: ["+ new line 1", "+ new line 2"],
    };

    expect(alignHunkLines(hunk)).toEqual([
      {
        oldLineNumber: undefined,
        oldLine: undefined,
        newLineNumber: 5,
        newLine: " new line 1",
      },
      {
        oldLineNumber: undefined,
        oldLine: undefined,
        newLineNumber: 6,
        newLine: " new line 2",
      },
    ]);
  });

  it("aligns mixed additions and deletions", () => {
    const hunk: StructuredPatchHunk = {
      oldStart: 10,
      newStart: 20,
      oldLines: 2,
      newLines: 3,
      lines: ["- old line 1", "- old line 2", "+ new line 1", "+ new line 2", "+ new line 3"],
    };

    expect(alignHunkLines(hunk)).toEqual([
      {
        oldLineNumber: 10,
        oldLine: " old line 1",
        newLineNumber: 20,
        newLine: " new line 1",
      },
      {
        oldLineNumber: 11,
        oldLine: " old line 2",
        newLineNumber: 21,
        newLine: " new line 2",
      },
      {
        oldLineNumber: undefined,
        oldLine: undefined,
        newLineNumber: 22,
        newLine: " new line 3",
      },
    ]);
  });

  it("handles interleaved unchanged, removed and added lines", () => {
    const hunk: StructuredPatchHunk = {
      oldStart: 1,
      newStart: 1,
      oldLines: 3,
      newLines: 3,
      lines: [" unchanged line 1", "- removed line", "+ added line", " unchanged line 2"],
    };

    expect(alignHunkLines(hunk)).toEqual([
      {
        oldLineNumber: 1,
        oldLine: "unchanged line 1",
        newLineNumber: 1,
        newLine: "unchanged line 1",
      },
      {
        oldLineNumber: 2,
        oldLine: " removed line",
        newLineNumber: 2,
        newLine: " added line",
      },
      {
        oldLineNumber: 3,
        oldLine: "unchanged line 2",
        newLineNumber: 3,
        newLine: "unchanged line 2",
      },
    ]);
  });
});
