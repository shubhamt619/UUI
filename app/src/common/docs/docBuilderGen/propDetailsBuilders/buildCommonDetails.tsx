import { TDetailsBuilder } from '../types';

export const buildCommonDetails: TDetailsBuilder = (params) => {
    const { prop } = params;
    const details: ReturnType<TDetailsBuilder> = {};
    const description = prop.comment?.raw?.join('\n').trim(); // TODO: need a better handling
    if (description) {
        details.description = description;
    }
    if (prop.required) {
        details.isRequired = true;
    }
    return details;
};
