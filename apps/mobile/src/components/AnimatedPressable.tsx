import React from 'react';
import { Pressable, PressableProps } from 'react-native';
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
}

export default function AnimatedPressable({
    children,
    style,
    onPress,
    scaleDepth = 0.97,
    ...props
}: Props) {
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPress
            onPressIn={() => {
                scale.value = withSpring(scaleDepth, { damping: 15, stiffness: 200 });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 12, stiffness: 180 });
            }}
            onPress={onPress}
            style={[animStyle, style as any]}
            {...props}
        >
            {children}
        </AnimatedPress>
    );
}
