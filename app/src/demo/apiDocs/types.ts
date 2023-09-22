export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
export type TTypeRef = {
    typeName: TTypeName,
    module?: string,
    source?: string;
};
export type TType = {
    kind: string;
    typeRef: TTypeRef;
    typeValue: TTypeValue;
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    uniqueId: string;
    kind: string;
    name: string;
    typeValue: TTypeValue;
    comment?: string[];
    required: boolean;
    from?: TTypeRef;
};
export type TPropsV2Response = Record<string, TType>;

export type TTsDocExportedEntry = Autogenerated_TTsDocExportedEntry;
