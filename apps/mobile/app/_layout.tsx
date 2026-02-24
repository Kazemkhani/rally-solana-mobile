import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/utils/constants';
import SplashScreen from '../src/components/SplashScreen';
import { ToastProvider } from '../src/components/Toast';

// Web-only global CSS polish
if (Platform.OS === 'web') {
    require('../src/global.web.css');
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 2,
        },
    },
});

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <ToastProvider>
                    <StatusBar style="light" />
                    {showSplash && (
                        <SplashScreen onFinish={() => setShowSplash(false)} />
                    )}
                    {!showSplash && (
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: COLORS.background },
                                animation: 'fade',
                            }}
                        />
                    )}
                </ToastProvider>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
