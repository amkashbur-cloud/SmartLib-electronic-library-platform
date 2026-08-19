import { createRng, intBetween, pick } from "./prng";
import type { Resource } from "./types";

const FILLER_SENTENCES = [
  "This section introduces the underlying concepts before moving to applied examples.",
  "Readers are encouraged to compare this approach against the alternatives discussed earlier.",
  "The following discussion builds directly on the terminology defined in the introduction.",
  "A worked example illustrates how the method behaves under typical conditions.",
  "Practitioners often adapt this framework to fit the constraints of their own organization.",
  "Subsequent chapters revisit this idea in the context of real-world case studies.",
  "The evidence presented here is representative rather than exhaustive.",
  "Note the tradeoffs between simplicity and completeness in the model described above.",
  "This placeholder content demonstrates the reading experience without using copyrighted text.",
  "For a deeper treatment of this topic, see the related resources listed on the resource page.",
];

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h >>> 0;
}

export function generateReaderPages(resource: Resource): string[] {
  const rng = createRng(hashSeed(resource.id));
  const pageCount = intBetween(rng, 8, 14);
  const pages: string[] = [];

  pages.push(
    `${resource.title}\n\n${resource.description}\n\nThis is a demo document generated for the SmartLib training platform. It does not contain the real text of any copyrighted work.`
  );

  for (let i = 2; i <= pageCount; i++) {
    const sentenceCount = intBetween(rng, 4, 7);
    const sentences = Array.from({ length: sentenceCount }, () => pick(rng, FILLER_SENTENCES));
    pages.push(`Section ${i - 1}\n\n${sentences.join(" ")}`);
  }

  return pages;
}
