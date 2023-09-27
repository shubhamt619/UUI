import React from 'react';
import { Anchor, Text, Tooltip } from '@epam/uui';
import css from './Ref.module.scss';
import { useTsDocs } from '../../dataHooks';
import { TTypeRefShort } from '../../docsGenSharedTypes';

export function Ref(props: { typeRefShort?: TTypeRefShort }) {
    const { typeRefShort } = props;
    const tsDocs = useTsDocs();
    if (!tsDocs || !typeRefShort) {
        return null;
    }
    const typeRefLong = tsDocs.getTypeRef(typeRefShort);
    const isLinkable = !!tsDocs.get(typeRefShort);

    if (typeRefLong) {
        const { module, typeName } = typeRefLong;
        let contentNode: React.ReactNode = typeName.nameFull;
        if (module && typeName) {
            const link = { pathname: '/documents', query: { id: typeRefShort } };
            contentNode = (
                <>
                    { isLinkable && <Anchor link={ link }>{typeName.nameFull}</Anchor> }
                    { !isLinkable && <Tooltip content="This type isn't exported"><span>{typeName.nameFull}</span></Tooltip> }
                    <span className={ css.moduleName }>
                        {`${module}`}
                    </span>
                </>
            );
        }
        return (
            <Text key={ typeName.name } cx={ css.root }>
                { contentNode }
            </Text>
        );
    }
    return null;
}