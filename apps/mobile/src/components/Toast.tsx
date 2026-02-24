import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
} from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../utils/constants';

interface ToastMessage {
    id: string;
    text: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
}

let _addToast: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

// Global toast function — call from anywhere
export function showToast(text: string, type: 'success' | 'error' | 'info' = 'success', duration = 2500) {
    _addToast?.({ text, type, duration });
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
    const translateY = useSharedValue(-80);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withTiming(0, { duration: 300 });
        opacity.value = withTiming(1, { duration: 300 });

        const dur = toast.duration || 2500;
        translateY.value = withDelay(dur, withTiming(-80, { duration: 250 }));
        opacity.value = withDelay(dur, withTiming(0, { duration: 250 }, () => {
            runOnJS(onDismiss)(toast.id);
        }));
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const iconMap = { success: '✓', error: '✕', info: 'ℹ' };
    const colorMap = {
        success: COLORS.success,
        error: COLORS.danger,
        info: COLORS.streamBlue,
    };
    const icon = iconMap[toast.type || 'success'];
    const accent = colorMap[toast.type || 'success'];

    return (
        <Animated.View style={[styles.toast, animStyle]}>
            <View style={[styles.toastIcon, { backgroundColor: accent + '20' }]}>
                <Text style={[styles.toastIconText, { color: accent }]}>{icon}</Text>
            </View>
            <Text style={styles.toastText}>{toast.text}</Text>
        </Animated.View>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

    const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { ...msg, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        _addToast = addToast;
        return () => { _addToast = null; };
    }, [addToast]);

    return (
        <View style={{ flex: 1 }}>
            {children}
            <View style={styles.toastContainer} pointerEvents="none">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: SPACING.xl,
        right: SPACING.xl,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 17, 34, 0.95)',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.full,
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.12)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            } as any,
            default: {},
        }),
    },
    toastIcon: {
        width: 24, height: 24, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    toastIconText: { fontSize: 12, fontWeight: '700' },
    toastText: {
        fontSize: FONT_SIZES.md, fontWeight: '600',
        color: COLORS.text, flexShrink: 1,
    },
});
