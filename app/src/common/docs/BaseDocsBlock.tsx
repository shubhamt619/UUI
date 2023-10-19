import * as React from 'react';
import {
    RichTextView, FlexRow, MultiSwitch, FlexSpacer, TabButton, ScrollBars,
} from '@epam/promo';
import { svc } from '../../services';
import { getQuery } from '../../helpers';
import { analyticsEvents } from '../../analyticsEvents';
import css from './BaseDocsBlock.module.scss';
import { TDocsGenExportedType } from '../apiReference/types';
import { ApiRefTypeProps } from '../apiReference/ApiRefTypeProps';
import { TDocConfig, TSkin } from './docBuilderGen/types';
import { ComponentEditorWrapper } from './componentEditor/ComponentEditorWrapper';

export { TSkin };

const DEFAULT_SKIN = TSkin.UUI4_promo;

export const UUI3 = TSkin.UUI3_loveship;
export const UUI4 = TSkin.UUI4_promo;
export const UUI = TSkin.UUI;

const items: { id: TSkin; caption: string }[] = [
    { caption: 'UUI3 [Loveship]', id: TSkin.UUI3_loveship }, { caption: 'UUI4 [Promo]', id: TSkin.UUI4_promo }, { caption: 'UUI [Themebale]', id: TSkin.UUI },
];

export type TDocsGenType = TDocsGenExportedType;
type DocPath = {
    [key in TSkin]?: string;
};

interface BaseDocsBlockState {}

export abstract class BaseDocsBlock extends React.Component<any, BaseDocsBlockState> {
    constructor(props: any) {
        super(props);

        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));
    }

    private getSkin(): TSkin {
        return getQuery('skin') || DEFAULT_SKIN;
    }

    abstract title: string;
    abstract renderContent(): React.ReactNode;
    protected getPropsDocPath(): DocPath {
        return null;
    }

    protected getDocsGenType(): TDocsGenType | undefined {
        return undefined;
    }

    config: TDocConfig;

    renderApiBlock() {
        const docsGenType = this.getDocsGenType();
        if (docsGenType) {
            return (
                <>
                    <RichTextView>
                        <h2>Api</h2>
                    </RichTextView>
                    <ApiRefTypeProps showCode={ true } typeRef={ docsGenType } />
                </>
            );
        }
    }

    renderMultiSwitch() {
        return (
            <MultiSwitch<TSkin>
                size="36"
                items={ items.filter((i) => (!window.location.host.includes('localhost') ? i.id !== TSkin.UUI : true)) }
                value={ this.getSkin() }
                onValueChange={ (newValue: TSkin) => this.handleChangeSkin(newValue) }
            />
        );
    }

    renderTabsNav() {
        return (
            <FlexRow rawProps={ { role: 'tablist' } } background="white" padding="12" cx={ css.secondaryNavigation } borderBottom>
                <TabButton size="60" caption="Documentation" isLinkActive={ getQuery('mode') === 'doc' } onClick={ () => this.handleChangeMode('doc') } />
                <TabButton size="60" caption="Property Explorer" isLinkActive={ getQuery('mode') === 'propsEditor' } onClick={ () => this.handleChangeMode('propsEditor') } />
                <FlexSpacer />
                {getQuery('mode') !== 'doc' && this.renderMultiSwitch()}
            </FlexRow>
        );
    }

    assertPropEditorSupported = (): void => {
        const hasOldPropsDocPath = !!this.getPropsDocPath();
        const hasNewDocConfig = !!this.config;
        if (!hasOldPropsDocPath && !hasNewDocConfig) {
            svc.uuiRouter.redirect({
                pathname: '/documents',
                query: {
                    category: getQuery('category'),
                    id: getQuery('id'),
                    mode: getQuery('doc'),
                    skin: getQuery('skin'),
                },
            });
            return null;
        }
    };

    renderPropsEditor() {
        const skin = getQuery('skin') as TSkin;
        this.handleChangeBodyTheme(skin);
        this.assertPropEditorSupported();

        return (
            <ComponentEditorWrapper
                onRedirectBackToDocs={ () => {
                    svc.uuiRouter.redirect({
                        pathname: '/documents',
                        query: {
                            category: 'components',
                            id: getQuery('id'),
                            mode: 'doc',
                            skin,
                        },
                    });
                } }
                oldConfig={ this.getPropsDocPath() }
                config={ this.config }
                title={ this.title }
                skin={ skin }
                docsGenType={ this.getDocsGenType() }
            />
        );
    }

    renderSectionTitle(title: string) {
        return (
            <RichTextView>
                <h2>{title}</h2>
            </RichTextView>
        );
    }

    renderDocTitle() {
        return (
            <RichTextView>
                <h1>{this.title}</h1>
            </RichTextView>
        );
    }

    renderDoc() {
        return (
            <ScrollBars>
                <div className={ css.widthWrapper }>
                    {this.renderDocTitle()}
                    {this.renderContent()}
                    {this.renderApiBlock()}
                </div>
            </ScrollBars>
        );
    }

    handleChangeSkin(skin: TSkin) {
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: getQuery('category'),
                id: getQuery('id'),
                mode: getQuery('mode'),
                skin: skin,
            },
        });
        this.handleChangeBodyTheme(skin);
    }

    handleChangeBodyTheme(skin: TSkin) {
        const theme = document.body.classList.value.match(/uui-theme-(\S+)\s*/)[1];
        if (theme === skin.split('_')[1]) return;
        document.body.classList.remove(`uui-theme-${theme}`);
        document.body.classList.add(`uui-theme-${skin === UUI3 ? 'loveship' : 'promo'}`);
    }

    componentWillUnmount() {
        this.handleChangeBodyTheme(TSkin.UUI4_promo);
    }

    handleChangeMode(mode: 'doc' | 'propsEditor') {
        this.handleChangeBodyTheme(TSkin.UUI4_promo);

        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: getQuery('id'),
                mode: mode,
                skin: getQuery('skin'),
            },
        });
    }

    render() {
        return (
            <div className={ css.container }>
                {this.getPropsDocPath() && this.renderTabsNav()}
                {getQuery('mode') === 'propsEditor' ? this.renderPropsEditor() : this.renderDoc()}
            </div>
        );
    }
}
