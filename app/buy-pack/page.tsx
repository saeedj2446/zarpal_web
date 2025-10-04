"use client";
import BankSimulation from "./BankSimulation";
import {Suspense} from "react";


export default function BuyPack() {
    return   <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <BankSimulation />
    </Suspense>;
}