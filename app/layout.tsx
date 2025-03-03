import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import {NavBar} from "@/components/NavBar";
import {Toasts} from "@/components/Toasts";

import '@/styles/global.css';
import {SessionProvider} from "next-auth/react";
import theme from "@/styles/theme";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className='p-0 m-0'>
        <body className='p-0 m-0 bg-white'>
        <SessionProvider>
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <NavBar></NavBar>
                    <div className='p-20 flex justify-center items-center'>
                        {children}
                    </div>
                    <Toasts/>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
