import { useSignOut } from '@/api/auth'
import { ThemeContext } from '@/context/ThemeProvider'
import { SettingsModalProps } from '@/models/modals/settingsModal'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import type { FunctionComponent } from 'react'
import { useContext } from 'react'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const SettingsModal: FunctionComponent<SettingsModalProps> = ({ visible, onClose }) => {
    const { colors } = useContext(ThemeContext)
    const { mutate: signOut } = useSignOut()
    const router = useRouter()

    const Logout = () => {
        onClose()
        signOut(undefined, {
            onSuccess: () => {
                router.replace('/login/login')
            },
        })
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.modal, { backgroundColor: colors.card }]}>
                    <Text style={[styles.title, { color: colors.text }]}>Instellingen</Text>
                    
                    <TouchableOpacity 
                        style={[styles.logoutButton, { backgroundColor: colors.error + '20' }]}
                        onPress={Logout}
                    >
                        <Ionicons name="log-out-outline" size={20} color={colors.error} />
                        <Text style={[styles.logoutText, { color: colors.error }]}>Uitloggen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Annuleren</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '500',
    },
    cancelButton: {
        marginTop: 12,
        padding: 14,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
    },
})

export default SettingsModal
