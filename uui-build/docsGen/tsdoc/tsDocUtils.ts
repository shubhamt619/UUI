import {
    DocBlock,
    DocComment,
    DocPlainText,
    ParserContext,
    Standardization,
    TSDocConfiguration,
    TSDocParser,
    TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';
import { TComment } from '../types/sharedTypes';

export class TsDocUtils {
    static parseComment(rawComment: string): TComment['tags'] {
        const cfg = Object.values(CUSTOM_TAGS).reduce((acc, { tagDefinition }) => {
            acc.addTagDefinition(tagDefinition);
            return acc;
        }, new TSDocConfiguration());
        const tsdocParser: TSDocParser = new TSDocParser(cfg);
        const parserContext: ParserContext = tsdocParser.parseString(rawComment);
        const docComment: DocComment = parserContext.docComment;

        const tags = docComment.customBlocks.reduce<Record<string, any>>((acc, db) => {
            const name = db.blockTag.tagName as keyof typeof CUSTOM_TAGS;
            const tag = CUSTOM_TAGS[name];
            if (tag) {
                const { extracted, value } = tag.parser(db);
                if (extracted) {
                    acc[name] = value;
                }
            }
            return acc;
        }, {});
        if (Object.keys(tags).length > 0) {
            return tags;
        }
    }
}

const CUSTOM_TAGS = {
    '@default': {
        tagDefinition: {
            tagName: '@default',
            syntaxKind: TSDocTagSyntaxKind.BlockTag,
            standardization: Standardization.Discretionary,
            allowMultiple: false,
            tagNameWithUpperCase: '@DEFAULT',
        },
        parser: (db: DocBlock) => {
            const valueParts = db.getChildNodes()[1]; // DocSection
            const firstValuePart = valueParts.getChildNodes()[0]; // DocParagraph
            const txt = firstValuePart.getChildNodes()[0]; // DocPlainText
            if (txt instanceof DocPlainText) {
                const txtValue = txt?.text?.trim();
                if (typeof txtValue !== 'undefined') {
                    let value: boolean | string | number = txtValue;
                    if (txtValue === 'true' || txtValue === 'false') {
                        value = txtValue === 'true';
                    } else if (!isNaN(+txtValue)) {
                        value = +txtValue;
                    } else if (txtValue[0] === '\'' && txtValue[txtValue.length - 1] === '\'') {
                        value = txtValue.substring(1, txtValue.length - 1);
                    } else {
                        return;
                    }
                    return {
                        extracted: true,
                        value,
                    };
                }
            }
        },
    },
};
