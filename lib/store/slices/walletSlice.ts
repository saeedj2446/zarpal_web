// walletSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
    currentWallet: any; // فقط کیف انتخاب شده
}

const initialState: WalletState = {
    currentWallet: null,
};

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setCurrentWallet: (state, action: PayloadAction<{ currentWallet: any }>) => {
            state.currentWallet = action.payload.currentWallet;
        },
        clearCurrentWallet: (state) => {
            state.currentWallet = null;
        },
    },
});

export const { setCurrentWallet, clearCurrentWallet } = walletSlice.actions;

export default walletSlice.reducer;
