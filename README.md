# expo-context-menu

Context Menu For Expo

## Installation

```sh
npm install @appandflow/expo-context-menu
```

## Usage

Wrap your application with the ExpoContextMenuProvider

```tsx
import { ExpoContextMenuProvider } from '@appanflow/expo-context-menu';

<ExpoContextMenuProvider>
  <YourApp />
</ExpoContextMenuProvider>
```

Then you can use the lib with the ExpoContextMenu component

```tsx
import { ExpoContextMenu } from '@appandflow/expo-context-menu';

<ExpoContextMenu
  onPress={onPress}
  menuItems={[
    {
      title: 'Add to Favorites',
      onPress: () => null,
      icon: <Icon name="Heart" color={colors.black1} size={18} />,
    },
    {
      title: 'Share',
      onPress: () => null,
      icon: <Icon name="Share" color={colors.black1} size={18} />,
    },
  ]}
>
  <YourComponent />
</ExpoContextMenu>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
