import type { ReleaseGroup } from "../types/jira";

export const extractNumbers = (text: string): string => {
  return text.replace(/[^0-9.]/g, "");
};

export const compareReleaseNameDesc = (
  a: ReleaseGroup,
  b: ReleaseGroup,
): number => {
  return b.releaseName.localeCompare(a.releaseName, undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

export const sortReleasesDesc = (
  releases: ReleaseGroup[] = [],
): ReleaseGroup[] => {
  return [...releases].sort(compareReleaseNameDesc);
};
