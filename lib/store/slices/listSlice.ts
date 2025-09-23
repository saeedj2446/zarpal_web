import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {DtoIn_filterReqi} from "@/lib/types";


interface RequestListState {
    listId?: number;
    pageCount?: number;
    filters?: DtoIn_filterReqi;
    currentPage: number;
}

const initialState: RequestListState = {
    listId: undefined,
    pageCount: undefined,
    filters: undefined,
    currentPage: 1,
};

const listSlice = createSlice({
    name: "requestList",
    initialState,
    reducers: {
        setListMeta: (
            state,
            action: PayloadAction<{ listId: number; pageCount: number }>
        ) => {
            state.listId = action.payload.listId;
            state.pageCount = action.payload.pageCount;
            state.currentPage = 1;
        },
        setFilters: (state, action: PayloadAction<DtoIn_filterReqi>) => {
            state.filters = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        reset: (state) => {
            state.listId = undefined;
            state.pageCount = undefined;
            state.filters = undefined;
            state.currentPage = 1;
        },
    },
});

export const { setListMeta, setFilters, setPage, reset } =
    listSlice.actions;

export default listSlice.reducer;
