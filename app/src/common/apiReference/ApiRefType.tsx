import React from 'react';
import { useDocsGenForType } from './dataHooks';
import { Code } from '../docs/Code';
import { TsComment } from './components/TsComment';
import { Layout } from './components/Layout';
import { ApiRefTypeProps } from './ApiRefTypeProps';
import { useSearchParams } from 'react-router-dom';
import { TDocsGenExportedType } from './types';
import { TTypeRef } from './sharedTypes';

export function ApiRefType() {
    const [params] = useSearchParams();
    const typeRefShort = params?.get('id') as TTypeRef;
    const docsGenType = useDocsGenForType(typeRefShort);

    const items: { title?: string, node: React.ReactNode }[] = [];
    const comment = docsGenType?.summary?.comment;
    if (comment?.raw?.length) {
        items.push({
            title: 'Description',
            node: <TsComment comment={ comment } keepBreaks={ true } />,
        });
    }

    if (docsGenType?.details) {
        const hasProps = docsGenType.details.props?.length;
        if (hasProps) {
            const entry = typeRefShort as TDocsGenExportedType;
            items.push({
                node: <ApiRefTypeProps key={ entry } typeRef={ entry } showCode={ true } />,
            });
        }
        if (!hasProps) {
            items.push({
                node: <Code codeAsHtml={ docsGenType.details.typeValue?.print?.join('\n') || '' } />,
            });
        }
    }

    const title = docsGenType?.summary?.typeName.nameFull;
    return (
        <Layout title={ title }>
            {items}
        </Layout>
    );
}
