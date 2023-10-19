import { convertToGenericFormat, TDocConfig, TSkin } from '../docBuilderGen/types';
import React, { useEffect, useMemo, useState } from 'react';
import css from './ComponentEditorWrapper.module.scss';
import { LinkButton, Spinner, Text } from '@epam/promo';
import { IComponentDocs } from '@epam/uui-docs';
import { TDocsGenExportedType } from '../../apiReference/types';
import { docBuilderGen } from '../docBuilderGen/docBuilderGen';
import { loadPropsFile } from './loadPropsFile';
import { ComponentEditor } from './ComponentEditor';

interface IComponentEditorWrapper {
    title: string;
    docsGenType?: TDocsGenExportedType;
    skin: TSkin;
    oldConfig?: {
        [key in TSkin]?: string;
    };
    config: TDocConfig;
    onRedirectBackToDocs: () => void;
}
export function ComponentEditorWrapper(props: IComponentEditorWrapper) {
    const {
        title,
        skin,
        config,
        oldConfig,
        docsGenType,
        onRedirectBackToDocs,
    } = props;
    const [generateDocs, setGenerateDocs] = useState(false);
    const { isLoaded, docs } = useComponentDocsAdapter({
        config,
        docsGenType,
        skin,
        oldConfig,
        generateDocs,
    });

    useEffect(() => {
        setGenerateDocs(false);
    }, [skin]);

    useEffect(() => {
        if (!config && !oldConfig) {
            onRedirectBackToDocs();
        }
    }, [config, oldConfig, onRedirectBackToDocs]);
    const isGenerateDocSupported = useMemo(() => {
        return !!convertToGenericFormat(config)?.bySkin?.[skin] || (docsGenType && oldConfig[skin] && skin === TSkin.UUI);
    }, [config, docsGenType, oldConfig, skin]);

    if (isLoaded) {
        if (docs) {
            return (
                <ComponentEditor
                    docs={ docs }
                    title={ title }
                    skin={ skin }
                    onChangeGenerateDoc={ (isGenerate) => setGenerateDocs(isGenerate) }
                    generateDoc={ generateDocs }
                    isGenerateDocSupported={ isGenerateDocSupported }
                />
            );
        }
        return <NotSupportedForSkin onRedirectBackToDocs={ onRedirectBackToDocs } />;
    }
    return <Spinner />;
}

function NotSupportedForSkin(props: { onRedirectBackToDocs: () => void }) {
    return (
        <div className={ css.notSupport }>
            <Text fontSize="16" lineHeight="24">
                This component does not support property explorer
            </Text>
            <LinkButton
                size="24"
                cx={ css.backButton }
                caption="Back to Docs"
                onClick={ () => props.onRedirectBackToDocs() }
            />
        </div>
    );
}

function useComponentDocsAdapter(params: {
    oldConfig?: { [key in TSkin]?: string };
    docsGenType?: TDocsGenExportedType,
    config?: TDocConfig;
    skin: TSkin;
    generateDocs: boolean;
}): { docs?: IComponentDocs<any>, isLoaded: boolean } {
    const {
        skin,
        config,
        oldConfig,
        docsGenType,
        generateDocs,
    } = params;
    const [res, setRes] = React.useState<{
        isLoaded: boolean;
        docs?: IComponentDocs<any>;
    }>({ isLoaded: false });

    useEffect(() => {
        if (generateDocs && config) {
            docBuilderGen({ config: convertToGenericFormat(config), skin }).then((docs) => {
                setRes({
                    isLoaded: true,
                    docs,
                });
            });
        } else if (generateDocs && skin === TSkin.UUI && docsGenType && oldConfig[skin]) {
            // Temporary code. We try to build the new config using old config
            loadPropsFile(oldConfig[skin]).then(({ component, name }) => {
                const _newConfig: TDocConfig = {
                    name,
                    type: docsGenType,
                    component,
                };
                return docBuilderGen({ config: convertToGenericFormat(_newConfig), skin }).then((docs) => {
                    setRes({
                        isLoaded: true,
                        docs,
                    });
                });
            });
        } else if (oldConfig[skin]) {
            // Temporary code
            loadPropsFile(oldConfig[skin]).then((docs) => {
                setRes({
                    isLoaded: true,
                    docs,
                });
            });
        } else {
            setRes({
                isLoaded: true,
                docs: undefined,
            });
        }
    }, [docsGenType, config, oldConfig, skin, generateDocs]);

    return res;
}
