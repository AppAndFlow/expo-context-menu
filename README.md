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

## Props

#### menuItems

the items you pass when them menu get show

```tsx
{
  title: string;
  icon?: React.ReactElement;
  onPress: () => void;
  destructive?: boolean;
}[];
```

#### renderMenu | optional

if you want to overide the menu component you can pass a component


#### isFullScreen | optional

full screen layout animation vs the default one of just adding blur

#### onPress

the onPress event pass to the children

#### onLongPressStart | optional

callback when the long press start

#### onLongPressEnd | optional

callback when the long press end

#### onMenuOpen | optional

callback when the meny open

#### onMenuClose | optional

callback when the menu close

#### itemScaleOnMenuOpen | optional

the number as the scaling value of the item when the menu open

default: 0.97

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
