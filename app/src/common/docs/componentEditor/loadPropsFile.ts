import { IComponentDocs } from '@epam/uui-docs';

declare let require: any;

const PATH_PREFIX = './app/src/docs/_props'; // Keep it in sync with "uui-build/getComponentsPropsSet.ts"
// narrow down the context base path to speed up lookup.
const requireContext = require.context('../../../../../app/src/docs/_props', true, /\/(loveship|epam-promo|uui)\/.*\.props.(ts|tsx)$/, 'lazy');

export async function loadPropsFile(propsDocPath: string) {
    const propsDocPathRelative = `.${propsDocPath.substring(PATH_PREFIX.length)}`;
    const m = await requireContext(propsDocPathRelative);
    return m.default as IComponentDocs<any>;
}
