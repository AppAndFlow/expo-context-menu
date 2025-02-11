import './gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ExpoContextMenu,
  ExpoContextMenuProvider,
} from '@appandflow/expo-context-menu';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Cell = ({
  backgroundColor,
  label,
}: {
  backgroundColor: string;
  label: string;
}) => {
  return (
    <ExpoContextMenu
      isFullScreen
      menuItems={[
        {
          title: 'Share',
          icon: <Ionicons name="share" size={20} />,
          onPress: () => console.log('Share'),
        },
        {
          title: 'Add To Favorites',
          icon: <Ionicons name="star" size={20} />,
          onPress: () => console.log('Favorit'),
        },
        {
          title: 'Delete',
          icon: <Ionicons name="trash" size={20} />,
          onPress: () => console.log('Delete'),
          destructive: true,
        },
      ]}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E6E9EB',
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.22,
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white' }}>{label}</Text>
        </View>

        <View style={{ padding: 4, backgroundColor: 'white' }}>
          <Text>{label}</Text>
        </View>
      </View>
    </ExpoContextMenu>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Cell backgroundColor="red" label="A" />
        <Cell backgroundColor="blue" label="B" />
      </View>
      <View style={styles.row}>
        <Cell backgroundColor="green" label="C" />
        <Cell backgroundColor="purple" label="D" />
      </View>

      <View style={styles.row}>
        <Cell backgroundColor="red" label="A" />
        <Cell backgroundColor="blue" label="B" />
      </View>

      <View style={styles.row}>
        <Cell backgroundColor="green" label="C" />
        <Cell backgroundColor="purple" label="D" />
      </View>
    </View>
  );
};

const HomeNavigator = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <HomeNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeNavigator.Screen name="HomeScreen" component={HomeScreen} />
    </HomeNavigator.Navigator>
  );
};

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const RootNavigator = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpoContextMenuProvider>
        <NavigationContainer>
          <RootNavigator.Navigator screenOptions={{ headerShown: false }}>
            <RootNavigator.Screen
              name="TabNavigator"
              component={TabNavigator}
            />
          </RootNavigator.Navigator>
        </NavigationContainer>
      </ExpoContextMenuProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  container: {
    padding: 16,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
});
