import SettingsModal from '@/components/modals/settingsModal'
import { ThemeContext } from '@/context/ThemeProvider'
import useUser from '@/hooks/useUser'
import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs } from 'expo-router'
import { Home, Tag, Target } from 'lucide-react-native'
import type { FunctionComponent } from 'react'
import { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native'

const TabsLayout: FunctionComponent = () => {
    const user = useUser()
    const { colors } = useContext(ThemeContext)
    const [settingsVisible, setSettingsVisible] = useState(false)

    if (!user) {
        return <Redirect href="/login/login" />
    }

    const SettingsButton = () => (
        <TouchableOpacity
            style={{ marginRight: 16, padding: 8 }}
            onPress={() => setSettingsVisible(true)}
        >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
    )

    return (
        <>
            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
            />

            <Tabs
                screenOptions={{
                    headerRight: () => <SettingsButton />,
                }}
            >
                <Tabs.Screen
                    name="categories"
                    options={{
                        title: 'Categorieën',
                        tabBarIcon: ({ color, size }) => <Tag size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="goals"
                    options={{
                        title: 'Doelen',
                        tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout
