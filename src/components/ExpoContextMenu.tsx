import React, { Fragment, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Dimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSequence,
  withDelay,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
// import Portal from './Portal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ExpoContextMenuItem } from './ExpoContextMenuItem';
import { Portal } from 'react-native-portalize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface ContextMenuProps {
  children: React.ReactNode;
  menuItems?: {
    title: string;
    icon?: React.ReactElement;
    onPress: () => void;
    destructive?: boolean;
  }[];
  renderMenu?: () => React.ReactNode;
  isFullScreen?: boolean;
  onPress?: () => void;
}

export const ExpoContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menuItems,
  isFullScreen,
  onPress,
}) => {
  const childrenRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [childrenLayout, setChildrenLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [menuLayout, setMenuLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [show, setShow] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const menuOpacity = useSharedValue(0);
  const realChildrenOpacity = useSharedValue(1);
  const translateY = useSharedValue(20);
  const translateX = useSharedValue(0);

  const childrenScale = useSharedValue(1);
  const childrenOpacity = useSharedValue(1);
  const childrenTranslateX = useSharedValue(0);
  const childrenTranslateY = useSharedValue(0);

  const hasVerticalPlace =
    childrenLayout.y + childrenLayout.height + 20 + menuLayout.height <
    SCREEN_HEIGHT - insets.bottom;

  const hasHorizontalPlace = childrenLayout.x + menuLayout.width < SCREEN_WIDTH;

  const onChildrenLayout = () => {
    childrenRef.current?.measureInWindow((x, y, width, height) => {
      setChildrenLayout({ x, y, width, height });
    });
  };

  const onMenuLayout = (event: LayoutChangeEvent) => {
    if (menuLayout.width !== 0) {
      return;
    }
    setMenuLayout({
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  const onLongPress = async () => {
    const ANIM_DURATION = isFullScreen ? 200 : 50;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((resolve) => setTimeout(resolve, 150));

    const springOpts = isFullScreen
      ? {
          mass: 1,
          damping: 22,
          stiffness: 200,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.Never,
        }
      : {
          mass: 1,
          damping: 30,
          stiffness: 400,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.Never,
        };

    setShow(true);
    scale.value = withSpring(1, springOpts);
    opacity.value = withTiming(1, { duration: ANIM_DURATION });
    menuOpacity.value = withTiming(1, { duration: ANIM_DURATION / 2 });

    if (isFullScreen) {
      childrenScale.value = withSequence(
        withSpring(2.05, springOpts),
        withSpring(2, springOpts)
      );

      // Center horizontally - adjusted calculation
      const screenCenter = SCREEN_WIDTH / 2;
      const targetX = screenCenter - childrenLayout.height / 2;

      childrenTranslateX.value = withSpring(
        targetX - childrenLayout.x + 16,
        springOpts
      );

      const targetY =
        -childrenLayout.y + insets.top + 20 + childrenLayout.height / 2;

      translateY.value = withSpring(
        targetY + childrenLayout.height / 2,
        springOpts
      );

      const valX = childrenLayout.width / 2;

      translateX.value = withSpring(
        hasHorizontalPlace ? valX : -valX,
        springOpts
      );

      realChildrenOpacity.value = withSpring(0, springOpts);

      // Vertical positioning
      childrenTranslateY.value = withSpring(targetY, springOpts);
    } else {
      translateY.value = withSpring(0, springOpts);
      childrenScale.value = withSequence(
        withSpring(1.02, springOpts),
        withSpring(0.97, springOpts)
      );
    }

    childrenOpacity.value = withTiming(1, { duration: ANIM_DURATION });
  };

  const hideMenu = () => {
    const ANIMATION_DURATION = 250;
    const EASING = {
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    };

    scale.value = withTiming(0, {
      duration: ANIMATION_DURATION - 100,
      ...EASING,
    });
    opacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      ...EASING,
    });
    menuOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      ...EASING,
    });

    translateY.value = withTiming(
      20,
      { duration: ANIMATION_DURATION, easing: Easing.out(Easing.quad) },
      () => {
        runOnJS(setShow)(false);
      }
    );

    childrenScale.value = withSpring(1, { damping: 15 });
    childrenOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });

    if (isFullScreen) {
      childrenTranslateX.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        ...EASING,
      });
      childrenTranslateY.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        ...EASING,
      });
      realChildrenOpacity.value = withDelay(
        ANIMATION_DURATION - 200,
        withTiming(1, { duration: 100, easing: Easing.out(Easing.quad) })
      );
    }
  };

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      opacity: menuOpacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  const animatedChildrenStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: childrenTranslateX.value },
      { translateY: childrenTranslateY.value },
      { scale: childrenScale.value },
    ],
    opacity: childrenOpacity.value,
  }));

  const animatedRealChildrenStyle = useAnimatedStyle(() => ({
    opacity: realChildrenOpacity.value,
  }));

  return (
    <>
      <Animated.View
        style={animatedRealChildrenStyle}
        onLayout={onChildrenLayout}
        ref={childrenRef}
      >
        <Pressable
          delayLongPress={100}
          onLongPress={onLongPress}
          onPress={onPress}
        >
          {children}
        </Pressable>
      </Animated.View>

      <Portal>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'transparent',
              pointerEvents: show ? 'auto' : 'none',
            },
          ]}
        >
          <Pressable style={styles.overlay} onPress={hideMenu}>
            <AnimatedBlurView
              style={[styles.blurView, animatedBlurStyle]}
              intensity={30}
              tint="regular"
            >
              <Animated.View
                style={[
                  animatedChildrenStyle,
                  {
                    overflow: 'hidden',
                    position: 'absolute',
                    left: childrenLayout.x,
                    top: childrenLayout.y,
                    width: childrenLayout.width,
                    height: childrenLayout.height,
                  },
                ]}
              >
                {children}
              </Animated.View>
              <Animated.View
                onLayout={onMenuLayout}
                style={[
                  styles.menuContainer,
                  animatedMenuStyle,
                  {
                    position: 'absolute',
                    top:
                      hasVerticalPlace || isFullScreen
                        ? childrenLayout.y + childrenLayout.height + 20
                        : childrenLayout.y - childrenLayout.height - 20,
                    left: hasHorizontalPlace ? childrenLayout.x : undefined,
                    right:
                      !hasHorizontalPlace || isFullScreen
                        ? SCREEN_WIDTH - childrenLayout.x - childrenLayout.width
                        : undefined,
                  },
                ]}
              >
                {menuItems?.map((item, index) => {
                  return (
                    <Fragment key={item.title + index}>
                      <ExpoContextMenuItem {...item} />
                      {index !== menuItems.length - 1 && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: '#E6E9EB',
                            width: '100%',
                          }}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </Animated.View>
            </AnimatedBlurView>
          </Pressable>
        </Animated.View>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    backgroundColor: '#FAFBFB',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 250,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 5,
  },
});
