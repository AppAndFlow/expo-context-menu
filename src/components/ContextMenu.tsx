import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Dimensions, View } from 'react-native';
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
import { Portal } from 'react-native-context-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface ContextMenuProps {
  children: React.ReactNode;
  menuItems?: React.ReactNode;
  isFullScreen?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menuItems,
  isFullScreen,
}) => {
  const childrenRef = useRef<View>(null);
  const insets = useSafeAreaInsets();
  const [childrenLayout, setChildrenLayout] = useState({
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

  const hasPlace =
    childrenLayout.y + childrenLayout.height + 20 + 150 <
    SCREEN_HEIGHT - insets.bottom;

  const hasHorizontalPlace = childrenLayout.x + 250 < SCREEN_WIDTH;

  const onLayout = () => {
    childrenRef.current?.measureInWindow((x, y, width, height) => {
      setChildrenLayout({ x, y, width, height });
    });
  };

  const onLongPress = () => {
    setShow(true);
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 200 });
    menuOpacity.value = withTiming(1, { duration: 100 });

    if (isFullScreen) {
      childrenScale.value = withSequence(
        withSpring(2.1, { damping: 15 }),
        withSpring(2, { damping: 15 })
      );

      // Center horizontally - adjusted calculation
      const screenCenter = SCREEN_WIDTH / 2;
      const targetX = screenCenter - childrenLayout.height / 2;

      childrenTranslateX.value = withSpring(targetX - childrenLayout.x + 16, {
        damping: 15,
      });

      const targetY =
        -childrenLayout.y + insets.top + 20 + childrenLayout.height / 2;

      translateY.value = withSpring(targetY + childrenLayout.height / 2, {
        damping: 15,
      });

      const valX = childrenLayout.width / 2;

      translateX.value = withSpring(hasHorizontalPlace ? valX : -valX, {
        damping: 15,
      });

      realChildrenOpacity.value = withSpring(0, { damping: 15 });

      // Vertical positioning
      childrenTranslateY.value = withSpring(targetY, {
        damping: 15,
      });
    } else {
      translateY.value = withSpring(0, { damping: 15 });
      childrenScale.value = withSequence(
        withSpring(1.1, { damping: 15 }),
        withSpring(0.97, { damping: 15 })
      );
    }

    childrenOpacity.value = withTiming(1, { duration: 200 });
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
        { scale: scale.value },
        { translateY: translateY.value },
        { translateX: translateX.value },
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
        onLayout={onLayout}
        ref={childrenRef}
      >
        <Pressable onLongPress={onLongPress}>{children}</Pressable>
      </Animated.View>

      <Portal name="context-menu">
        {/* {show && ( */}
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
                  styles.childrenShadow,
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
                style={[
                  styles.menuContainer,
                  animatedMenuStyle,
                  {
                    position: 'absolute',
                    top:
                      hasPlace || isFullScreen
                        ? childrenLayout.y + childrenLayout.height + 20
                        : childrenLayout.y - childrenLayout.height - 20,
                    left: hasHorizontalPlace ? childrenLayout.x : undefined,
                    right: !hasHorizontalPlace
                      ? SCREEN_WIDTH - childrenLayout.x - childrenLayout.width
                      : undefined,
                  },
                ]}
              >
                {menuItems}
              </Animated.View>
            </AnimatedBlurView>
          </Pressable>
        </Animated.View>
        {/* )} */}
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
    // backgroundColor: 'red',
  },
  childrenShadow: {
    // backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5, // for Android
    // borderRadius: 8, // optional, for rounded corners
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
    // backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: '#FAFBFB',
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 250,
    padding: 0, // Remove padding since items will have their own
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
