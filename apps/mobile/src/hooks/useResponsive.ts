import { useWindowDimensions, Platform } from 'react-native';

const BREAKPOINT_DESKTOP = 768;
const BREAKPOINT_WIDE = 1200;

export function useResponsive() {
    const { width, height } = useWindowDimensions();

    // On native platforms, always return mobile
    if (Platform.OS !== 'web') {
        return {
            isDesktop: false,
            isWide: false,
            isMobile: true,
            width,
            height,
            contentMaxWidth: undefined as number | undefined,
            sidebarWidth: 0,
        };
    }

    const isDesktop = width >= BREAKPOINT_DESKTOP;
    const isWide = width >= BREAKPOINT_WIDE;

    return {
        isDesktop,
        isWide,
        isMobile: !isDesktop,
        width,
        height,
        contentMaxWidth: isDesktop ? (isWide ? 900 : 720) : undefined,
        sidebarWidth: isDesktop ? 240 : 0,
    };
}
