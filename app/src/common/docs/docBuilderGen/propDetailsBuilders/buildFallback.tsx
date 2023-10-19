import { TDetailsBuilder } from '../types';
import React from 'react';
import { PropDoc } from '@epam/uui-docs';

const FALLBACK: ReturnType<TDetailsBuilder> = {
    renderEditor: () => (<div style={ { color: 'red' } }>Can't resolve</div>),
    examples: [null],
};

export const buildFallback = (): Partial<PropDoc<any, any>> => {
    return FALLBACK;
};
