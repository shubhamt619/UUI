import { TTypeRef } from '../../../apiReference/sharedTypes';
import { DocBuilder, iCanRedirectDoc, iHasLabelDoc } from '@epam/uui-docs';
import { TDetailsBuilder } from '../types';
import { TDocsGenExportedType } from '../../../apiReference/types';
import {
    IAnalyticableClick,
    ICanBeInvalid,
    IDropdownToggler,
    IHasCaption,
    IHasForwardedRef,
    IHasPlaceholder,
    IHasRawProps,
} from '@epam/uui-core';

const COMMON_DOCS: Record<TTypeRef | TDocsGenExportedType, DocBuilder<any>> = {
    '@epam/uui-core:IDropdownToggler': new DocBuilder<IDropdownToggler>({ name: '' }).prop('ref', {
        examples: [{ name: '{ current: null }', value: { current: null } }],
    }),
    '@epam/uui-core:IHasForwardedRef': new DocBuilder<IHasForwardedRef<any>>({ name: '' }).prop('forwardedRef', {
        examples: [{ name: '{ current: null }', value: { current: null } }],
    }),
    '@epam/uui-core:IHasLabel': iHasLabelDoc,
    '@epam/uui-core:IHasCaption': new DocBuilder<IHasCaption>({ name: '' })
        .prop('caption', {
            examples: [
                { value: 'short text', isDefault: true },
                { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
                { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            ],
            type: 'string',
        }),
    '@epam/uui-core:IHasPlaceholder': new DocBuilder<IHasPlaceholder>({ name: '' })
        .prop('placeholder', {
            examples: ['Select country', 'Type text'],
            type: 'string',
        }),
    '@epam/uui-core:IHasRawProps': new DocBuilder<IHasRawProps<any>>({ name: '' })
        .prop('rawProps', {
            examples: [
                { value: {}, name: '{}' },
            ],
        }),
    '@epam/uui-core:ICanBeInvalid': new DocBuilder<ICanBeInvalid>({ name: 'isInvalid' })
        .prop('isInvalid', { examples: [true] })
        .prop('validationProps', { examples: [{ name: '{}', value: {} }] }),
    '@epam/uui-core:IAnalyticableClick': new DocBuilder<IAnalyticableClick>({ name: '' })
        .prop('clickAnalyticsEvent', {
            examples: [
                { value: { name: 'test' }, name: '{ name: "test" }' },
            ],
        }),
    '@epam/uui-core:ICanRedirect': iCanRedirectDoc,
};

const byFromRefMap = (ref: TTypeRef, propName: string) => {
    const db: DocBuilder<any> = COMMON_DOCS[ref];
    if (db) {
        const found = db.props.find((p) => p.name === propName);
        if (found) {
            const { name, ...details } = found;
            return details;
        }
    }
};

export const buildByFromRef: TDetailsBuilder = (params) => {
    const { prop } = params;
    const byFrom = byFromRefMap(prop.from, prop.name);
    if (byFrom) {
        return byFrom;
    }
};
