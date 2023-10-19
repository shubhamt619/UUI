import { TDetailsBuilder } from '../types';
import { buildCommonDetails } from './buildCommonDetails';
import { buildByFromRef } from './buildByFromRef';
import { buildByAlias } from './buildByAlias';
import { buildByGenericType } from './buildByGenericType';
import { buildFallback } from './buildFallback';

export const buildPropDetails: TDetailsBuilder = (params) => {
    const { prop, docs } = params;

    return {
        ...buildCommonDetails({ docs, prop }),
        ...buildSpecificDetails({ docs, prop }),
    };
};

const buildSpecificDetails: TDetailsBuilder = (params) => {
    const byFromRef = buildByFromRef(params);
    if (byFromRef) {
        return byFromRef;
    }
    const byAlias = buildByAlias(params);
    if (byAlias) {
        return byAlias;
    }
    const byGenericType = buildByGenericType(params);
    if (byGenericType) {
        return byGenericType;
    }
    return buildFallback();
};
