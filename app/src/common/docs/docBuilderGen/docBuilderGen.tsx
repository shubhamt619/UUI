import { TDocConfigGeneric, TSkin } from './types';
import { DocBuilder } from '@epam/uui-docs';
import { loadDocsGenType } from '../../apiReference/dataHooks';

import { applyGlobalOverride } from './docOverrides/globalOverride';
import { buildPropDetails } from './propDetailsBuilders/build';

export async function docBuilderGen(params: { config: TDocConfigGeneric, skin: TSkin }): Promise<DocBuilder<any> | undefined> {
    const { config } = params;
    const {
        name,
        doc: applyAllSkinsOverride,
        bySkin,
    } = config;
    const forSkin = bySkin[params.skin];
    if (forSkin) {
        const { doc: applySkinOverride, type: docGenType, component } = forSkin;
        const { content: type } = await loadDocsGenType(docGenType);

        const docs = new DocBuilder<any>({ name, component });
        const props = type.details?.props;
        props?.forEach((prop) => {
            const details = buildPropDetails({ prop, docs });
            docs.prop(prop.name, details);
        });
        applyGlobalOverride(docs);
        applySkinOverride && applySkinOverride(docs);
        applyAllSkinsOverride && applyAllSkinsOverride(docs);

        return docs;
    }
}
