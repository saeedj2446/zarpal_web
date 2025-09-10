"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useSelector, useDispatch } from "react-redux"
import { setAccessToken } from "@/lib/store/slices/authSlice"
import { setAuthToken } from "@/lib/api/apiRequest"
import {RootState} from "@/lib/store/store";


interface TokenProviderProps {
    h: number
    children: React.ReactNode
}

export default function TokenProvider({ h, children }: TokenProviderProps) {
    const { refreshToken, isPending } = useAuth()
    const [initialized, setInitialized] = useState(false)
    const dispatch = useDispatch()
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)

    useEffect(() => {
        let interval: NodeJS.Timeout

        const refresh = async () => {
            try {
                const newToken = await refreshToken()
                if (newToken) {
                    setAuthToken(newToken)
                    dispatch(setAccessToken({ accessToken: newToken }))
                }
            } catch (err) {
                console.error("Token refresh failed", err)
            }
        }

        const init = async () => {
            if (!initialized) {
                // اگر accessToken در استور موجوده، مستقیم ستش کن
                if (accessToken) {
                    setAuthToken(accessToken)
                } else {
                    // توکن نداریم → refresh بزن
                    await refresh()
                }

                setInitialized(true)

                // رفرش خودکار هر h ساعت
                interval = setInterval(refresh, h * 60 * 60 * 1000)
            }
        }

        init()

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [initialized, refreshToken, accessToken, dispatch, h])

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            </div>
        )
    }

    return <>{children}</>
}
