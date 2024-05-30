import type { RemarkPlugins } from "astro";
import { visit } from "unist-util-visit";

type RemarkFileAstroData = {
  astro?: {
    frontmatter?: {
      animSplit?: boolean;
      animSplitChar?: string;
    };
  };
};

const remarkAnimSplit: RemarkPlugins[0] = () => {
  return (tree, file) => {
    const astroData = file.data as RemarkFileAstroData;
    const { animSplit = false, animSplitChar = "§" } =
      astroData.astro?.frontmatter || {};

    if (!animSplit) return;

    visit(tree, "paragraph", (node) => {
      const oldChilds = node.children;
      node.children = [];
      for (const child of oldChilds) {
        if (child.type !== "text") {
          node.children.push(child);
          continue;
        }

        const split = child.value.split(animSplitChar).filter(Boolean); // filter Boolean removes empty
        for (const text of split) {
          node.children.push({
            type: "html",
            value: `<span class="anim-split">${text}</span>`,
          });
        }
      }
    });
  };
};

export default remarkAnimSplit;
