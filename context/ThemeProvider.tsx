import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { createContext } from 'react'
import { ColorValue, StyleSheet, useColorScheme, View } from 'react-native'

interface SpacingSizes {
  sm: number
  md: number
  lg: number
}

interface Spacing {
  padding: SpacingSizes
  margin: SpacingSizes
}

const defaultSpacing: Spacing = {
  padding: {
    sm: 5,
    md: 10,
    lg: 30,
  },
  margin: {
    sm: 5,
    md: 10,
    lg: 20,
  },
}

interface Colors {
  shadow: ColorValue | undefined
  primary: string
  background: string
  card: string
  text: string
  textSecondary: string
  border: string
  notification: string
  income: string
  expense: string
  warning: string
  success: string
  error: string
}

interface Theme {
  dark: boolean
  colors: Colors
}

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#6366f1',
    background: '#1a1a2e',
    card: '#16213e',
    text: '#e0e0e0',
    textSecondary: '#a0a0a0',
    border: '#404060',
    notification: '#6366f1',
    income: '#10b981',
    expense: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
    shadow: undefined
  },
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#6366f1',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    notification: '#6366f1',
    income: '#10b981',
    expense: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
    shadow: undefined
  },
}

export const ThemeContext = createContext<Theme & Spacing>({
  ...lightTheme,
  ...defaultSpacing,
})

const ThemeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const isDark = useColorScheme() === 'dark'
  const activeTheme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ ...activeTheme, ...defaultSpacing }}>
      <NavigationThemeProvider value={{ ...DefaultTheme, ...activeTheme }}>
        <StatusBar backgroundColor={activeTheme.colors.background} />
        <View style={[{ backgroundColor: activeTheme.colors.background }, styles.container]}>
          {children}
        </View>
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ThemeProvider
