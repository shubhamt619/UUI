import { Text, Checkbox, DatePicker, NumericInput, TextInput } from "epam-promo";
import React from "react";
import { DataColumnProps, DataQueryFilter } from "uui-core";
import { Product } from "uui-docs";

export const productColumns: DataColumnProps<Product, number, DataQueryFilter<Product>>[] = [
    {
        key: 'Name',
        caption: 'Name',
        render: p => <TextInput mode='cell' value={ p.Name } onValueChange={ () => {} } />,
        width: 200,
        fix: 'left',
        isSortable: true,
    },
    {
        key: 'Class',
        caption: 'Class',
        render: p => <TextInput mode='cell' value={ p.Class } onValueChange={ () => {} } />,
        width: 85,
        isSortable: true,
    },
    {
        key: 'Color',
        caption: 'Color',
        render: p => <TextInput mode='cell' value={ p.Color } onValueChange={ () => {} } />,
        width: 85,
        isSortable: true,
    },
    {
        key: 'DaysToManufacture',
        caption: 'Days To Manufacture',
        render: p => <NumericInput value={ p.DaysToManufacture } onValueChange={ () => {} }  min={ 0 } max={ 100500 } />,
        width: 200,
        isSortable: true,
    },
    {
        key: 'DiscontinuedDate',
        caption: 'Discontinued Date',
        render: p => <DatePicker format='MMM D, YYYY' mode='cell' value={ p.DiscontinuedDate } onValueChange={ () => {} } />,
        width: 200,
        isSortable: true,
    },
    {
        key: 'FinishedGoodsFlag',
        caption: 'Finished',
        render: p => <Checkbox value={ p.FinishedGoodsFlag } onValueChange={ () => {} } />,
        width: 100,
        isSortable: true,
    },
    {
        key: 'ListPrice',
        caption: 'List Price',
        render: p => <NumericInput value={ p.ListPrice } onValueChange={ () => {} } min={ 0 } max={ 100500 } />,
        width: 100,
        isSortable: true,
    },
    {
        key: 'MakeFlag',
        caption: 'In Production',
        render: p => <Checkbox value={ p.MakeFlag } onValueChange={ () => {} } />,
        width: 120,
        isSortable: true,
    },
    {
        key: 'ModifiedDate',
        caption: 'Modified Date',
        render: p => <DatePicker mode='cell' value={ p.ModifiedDate } onValueChange={ () => {} } format='MMM D, YYYY' />,
        width: 200,
        isSortable: true,
    },
    {
        key: 'ProductID',
        caption: 'ID',
        render: p => <Text>{ p.ProductID }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'ProductLine',
        caption: 'Product Line',
        render: p => <TextInput mode='cell' value={ p.ProductLine } onValueChange={ () => {} } />,
        width: 200,
        isSortable: true,
    },
    {
        key: 'ProductModelID',
        caption: 'Product Model',
        render: p => <Text>{ p.ProductModelID }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'ProductNumber',
        caption: 'Code',
        render: p => <TextInput mode='cell' value={ p.ProductNumber } onValueChange={ () => {} } />,
        width: 120,
        isSortable: true,
    },
    {
        key: 'StandardCost',
        caption: 'Standard Cost',
        render: p => <NumericInput value={ p.StandardCost } onValueChange={ () => {} } min={ 0 } max={ 100500 } />,
        width: 150,
        isSortable: true,
    },
    {
        key: 'ProductSubcategoryID',
        caption: 'Product Subcategory',
        render: p => <Text>{ p.ProductSubcategoryID }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'ReorderPoint',
        caption: 'Reorder Point',
        render: p => <Text>{ p.ReorderPoint }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'SafetyStockLevel',
        caption: 'Safety Stock Level',
        render: p => <Text>{ p.SafetyStockLevel }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'SellStartDate',
        caption: 'Sell Start',
        render: p => <Text>{ p.SellStartDate }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'Size',
        caption: 'Size',
        render: p => <Text>{ p.Size }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'SizeUnitMeasureCode',
        caption: 'Size Unit',
        render: p => <Text>{ p.SizeUnitMeasureCode }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'Style',
        caption: 'Style',
        render: p => <Text>{ p.Style }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'Weight',
        caption: 'Weight',
        render: p => <Text>{ p.Weight }</Text>,
        width: 200,
        isSortable: true,
    },
    {
        key: 'WeightUnitMeasureCode',
        caption: 'Weight Unit',
        render: p => <Text>{ p.WeightUnitMeasureCode }</Text>,
        width: 200,
        isSortable: true,
    },
]