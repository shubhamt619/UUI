import * as React from 'react';
import { DocBuilder, PropDoc } from '@epam/uui-docs';
import { TDocsGenExportedType } from '../../apiReference/types';
import { TTypeProp } from '../../apiReference/sharedTypes';

export enum TSkin {
    UUI3_loveship = 'UUI3_loveship',
    UUI4_promo = 'UUI4_promo',
    UUI = 'UUI'
}

export type TDocConfig = TDocConfigShort | TDocConfigGeneric;

export function convertToGenericFormat(c?: TDocConfig): TDocConfigGeneric | undefined {
    if (!c) {
        return undefined;
    }
    if (!isGenericFormat(c)) {
        const { name, doc, type, component } = c;
        return {
            name,
            bySkin: {
                [TSkin.UUI]: {
                    type,
                    component,
                    doc,
                },
            },
        };
    }
    return c;
}

export type TDetailsBuilder = (params: { docs: DocBuilder<any>, prop: TTypeProp }) => (Partial<PropDoc<any, any>> | undefined);

function isGenericFormat(c: TDocConfig): c is TDocConfigGeneric {
    return !!(c as TDocConfigGeneric).bySkin;
}

export type TDocConfigShort = {
    name: string,
    type: TDocsGenExportedType,
    component: React.ComponentType<any>,
    doc?: TDocOverride
};

export type TDocConfigGeneric = {
    name: string;
    bySkin: {
        [key in TSkin]?: {
            type: TDocsGenExportedType,
            component: React.ComponentType<any>,
            doc?: TDocOverride
        }
    };
    doc?: TDocOverride;
};

export type TDocOverride<K = any> = (doc: DocBuilder<K>) => void;
