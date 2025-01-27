import React from 'react';
import { FlexCell, FlexRow, Text } from '@epam/promo';
import css from './InfoSidebarPanel.module.scss';

interface InfoRowProps {
    title: string;
    value: any;
}

export function InfoRow({ title, value }: InfoRowProps) {
    return (
        <FlexRow padding="24">
            <FlexCell shrink={ 0 } width={ 162 }>
                <Text color="gray60">{title}</Text>
            </FlexCell>
            <Text cx={ css.noWrap }>{value}</Text>
        </FlexRow>
    );
}
