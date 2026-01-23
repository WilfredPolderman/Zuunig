import { MonthYearProvider } from '@/context/MonthYearProvider';
import ThemeProvider from '@/context/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import type { FunctionComponent } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const globalThisForRNFB = globalThis as unknown as { RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean }
globalThisForRNFB.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
})

import { scheduleDailyNotification } from '@/utils/notifications';
import { useEffect } from 'react';

const RootLayout: FunctionComponent = () => {
  useEffect(() => {
    scheduleDailyNotification(20, 0, 'Vergeet je uitgaven niet in te vullen!');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <MonthYearProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="login/login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </MonthYearProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
