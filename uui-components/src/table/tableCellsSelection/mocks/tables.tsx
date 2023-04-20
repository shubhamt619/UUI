import React from 'react';
import { DataColumnProps, DataRowProps } from '@epam/uui-core';

type Row = { salary: number; age: number; name: string; phone: string };
export const rowsMock: DataRowProps<Row, number>[] = [
    {
        id: 1,
        rowKey: '1',
        index: 0,
        value: {
            age: 10, salary: 1000, name: 'first', phone: 'some phone 1',
        },
    },
    {
        id: 2,
        rowKey: '2',
        index: 1,
        value: {
            age: 20, salary: 2000, name: 'second', phone: 'some phone 2',
        },
    },
    {
        id: 3,
        rowKey: '3',
        index: 2,
        value: {
            age: 30, salary: 3000, name: 'third', phone: 'some phone 3',
        },
    },
    {
        id: 4,
        rowKey: '4',
        index: 3,
        value: {
            age: 40, salary: 4000, name: 'fourth', phone: 'some phone 4',
        },
    },
];

export const columnsMock: DataColumnProps<Row, number>[] = [
    {
        key: 'age',
        width: 1,
        renderCell: () => <div>1</div>,
        canAcceptCopy: (from, to) => to.row.index % 2 === 0,
        canCopy: (cell) => cell.row.index % 2 === 0,
    },
    {
        key: 'salary',
        width: 1,
        renderCell: () => <div>1</div>,
        canAcceptCopy: (from, to) => true,
        canCopy: () => true,
    },
    {
        key: 'rate',
        width: 1,
        renderCell: () => <div>1</div>,
        canAcceptCopy: (from, to) => true,
        canCopy: (cell) => true,
    },
    {
        key: 'denyCopyCol',
        width: 1,
        renderCell: () => <div>1</div>,
        canAcceptCopy: (from, to) => false,
        canCopy: (cell) => false,
    },
];
