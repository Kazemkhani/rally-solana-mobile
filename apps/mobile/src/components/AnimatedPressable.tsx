import React from 'react';
import { Pressable, PressableProps, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
    children: React.ReactNode;
    scaleDepth?: number;
    opacityDepth?: number;
}

export default function AnimatedPressable({
    children,
    style,
    onPress,
    scaleDepth = 0.97,
    opacityDepth = 1,
    ...props
}: Props) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedPress
            onPressIn={() => {
                scale.value = withSpring(scaleDepth, { damping: 15, stiffness: 200 });
                opacity.value = withSpring(opacityDepth, { damping: 15, stiffness: 200 });
                if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                }
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 12, stiffness: 180 });
                opacity.value = withSpring(1, { damping: 12, stiffness: 180 });
            }}
            onPress={onPress}
            style={[animStyle, style as any]}
            {...props}
        >
            {children}
        </AnimatedPress>
    );
}
