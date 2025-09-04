// components/XFlatList.tsx
import React from "react";
import XScrollView from "./XScrollView";

type XFlatListProps<ItemT> = {
    data: ItemT[];
    renderItem: (item: ItemT, index: number) => React.ReactNode;
    keyExtractor?: (item: ItemT, index: number) => string;
    horizontal?: boolean;
    style?: React.CSSProperties;
    contentContainerStyle?: React.CSSProperties;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function XFlatList<ItemT>({
                                             data,
                                             renderItem,
                                             keyExtractor,
                                             horizontal = false,
                                             style,
                                             contentContainerStyle,
                                             onScroll,
                                             ...rest
                                         }: XFlatListProps<ItemT>) {
    return (
        <XScrollView
            horizontal={horizontal}
            style={style}
            contentContainerStyle={contentContainerStyle}
            onScroll={onScroll}
            {...rest}
        >
            {data.map((item, index) => (
                <div key={keyExtractor ? keyExtractor(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </XScrollView>
    );
}
