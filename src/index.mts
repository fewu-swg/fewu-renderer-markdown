import MarkdownIt from "markdown-it";
// @ts-ignore ; This project seems to be abandoned. Maybe there should be someone taking this up again.
import markdownItAdmonition from "markdown-it-admonition";
import hljs from "highlight.js";
import { abbr } from "@mdit/plugin-abbr";
import { alert } from "@mdit/plugin-alert";
import { footnote } from "@mdit/plugin-footnote";
import { mark } from "@mdit/plugin-mark";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";

import { readFile } from "fs/promises";
import { AbstractRenderer } from "@fewu-swg/abstract-types";

const md = MarkdownIt({
    html: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return '';
    }
});

md
    .use(abbr)
    .use(markdownItAdmonition, {
        types: ["abstract", "attention", "caution", "error", "info", "note", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"]
    })
    .use(alert, {
        alertNames: [
            "abstract", "attention", "caution", "error", "info", "note", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"
        ]
    })
    .use(footnote)
    .use(mark)
    .use(sub)
    .use(sup);

class MarkdownRenderer implements AbstractRenderer {
    __fewu__ = 'renderer';

    type = /\.md$/;

    toString(){
        return `Renderer<.md>@fewu-swg`;
    }

    async render(template: string, templatePath: string, variables: object): Promise<string> {
        return md.render(template);
    }

    async renderFile(templatePath: string, variables: object): Promise<string> {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return this.render(content, templatePath, variables);
    }

    // @@non-standard
    renderSync(template: string, _?: string, __?: object): string {
        return md.render(template);
    }

}

export { MarkdownRenderer, MarkdownRenderer as renderer };
