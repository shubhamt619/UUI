import { TDocOverride } from '../types';
import { DefaultContext } from '../../../../docs/_props/uui/docs';

export const applyGlobalOverride: TDocOverride = (docs) => {
    docs.withContexts(DefaultContext);
};
