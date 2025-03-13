![contextmenubanner](https://github.com/user-attachments/assets/e16da645-d2b1-4a98-8dad-b30cbfb202cf)
### About
App & Flow is a Montreal-based React Native engineering and consulting studio. We partner with the world’s top companies and are recommended by [Expo](https://expo.dev/consultants). Need a hand? Let’s build together. team@appandflow.com

# expo-context-menu

Crossplatform Context Menu component - compatible with Expo managed apps.
https://developer.apple.com/design/human-interface-guidelines/context-menus

## Example

With our library you can customize your context menu to have the look and feel of the native menus. You can see the full repository of this example [here](https://github.com/AppAndFlow/expo-context-menu-demo).

 <video src="https://github.com/user-attachments/assets/f67be9ec-4b58-4adc-8069-d66c357df7b3"> |

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

## Props

| Name | Description |
| ---- | ----------- |
| menuItems | Custom items you can display when the context menu is open |
```tsx
{
  title: string;
  icon?: React.ReactElement;
  onPress: () => void;
  destructive?: boolean;
}[];
```
| Name | Description |
| ---- | ----------- |
| renderMenu (optional) | Custom component to replace the container rendering the menuItems |
| isFullScreen (optional) | Boolean to have the full screen layout animation |
| onPress (optional) | Function to pass a custom event when pressing on the children |
| onLongPressStart (optional) | Callback to customize the long press starting action |
| onLongPressEnd (optional) | Callback to customize the long press ending action |
| onMenuOpen (optional) | Callback to customize the children when the menu is open |
| onMenuClose (optional) | Callback to customize the children when the menu closes | 
| itemScaleOnMenuOpen (optional) | Number to change the scale of the children when the menu is open (default to 0.97) |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
