/**
 * NOTE: Types in this file are shared with front-end and must be copied as-is:
 * From: uui-build/docsGen/types/sharedTypes.ts --> To: app/src/common/apiReference/sharedTypes.ts
 */
//

export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
/** Map moduleName to exportName */
export type TTypeRef = `${string}:${string}`;
/**
 * This type contains minimum info required to build a link to the type
 * or to show a short summary.
 */
export type TTypeSummary = {
    typeName: TTypeName;
    module: string;
    exported: boolean;
    src?: string;
    comment?: TComment;
};
export type TTypeDetails = {
    kind: number;
    typeValue: TTypeValue;
    propsFromUnion?: boolean;
    props?: TTypeProp[];
};
export type TComment = {
    raw: string[],
    tags: Record<string, any> | undefined,
};
export type TTypeProp = {
    uid: number;
    name: string;
    typeValue: TTypeValue;
    typeValueRef?: TTypeRef;
    editor: TPropEditor;
    required: boolean;
    comment?: TComment;
    from?: TTypeRef;
};
export type TType = {
    summary: TTypeSummary,
    details?: TTypeDetails;
};
export type TTypeRefMap = Record<TTypeRef, TType>;

/**
 * The options in this enum loosely resemble prop-types (https://www.npmjs.com/package/prop-types)
 */
export enum TPropEditorType {
    string = 'string',
    bool = 'bool',
    number = 'number',
    func = 'func',
    oneOf = 'oneOf',
    component = 'component'
}
export type TOneOfItemType = string | number | boolean | null | {
    negative: boolean;
    base10Value: string;
};
export type TPropEditor =
    { type: TPropEditorType.string } |
    { type: TPropEditorType.bool } |
    { type: TPropEditorType.number } |
    { type: TPropEditorType.func } |
    { type: TPropEditorType.component } |
    { type: TPropEditorType.oneOf, options: TOneOfItemType[] };
