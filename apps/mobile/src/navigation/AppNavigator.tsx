import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SquadScreen from '../screens/SquadScreen';
import PayScreen from '../screens/PayScreen';
import StreamScreen from '../screens/StreamScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Squads: '👥',
  Pay: '💸',
  Streams: '🔄',
  Profile: '👤',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isPay = route.name === 'Pay';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isPay && styles.payTabItem]}
            activeOpacity={0.7}
          >
            {isPay ? (
              <View style={styles.payButton}>
                <Text style={styles.payIcon}>{TAB_ICONS[route.name]}</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                  {TAB_ICONS[route.name]}
                </Text>
                <Text
                  style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
                >
                  {route.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Squads" component={SquadScreen} />
        <Tab.Screen name="Pay" component={PayScreen} />
        <Tab.Screen name="Streams" component={StreamScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  payTabItem: {
    marginTop: -20,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  payButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  payIcon: {
    fontSize: 24,
  },
});
