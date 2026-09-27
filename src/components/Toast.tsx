import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme/colors';

type ToastValue = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (next: string) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setMessage(next);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();

      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setMessage(null);
          }
        });
      }, 3200);
    },
    [opacity],
  );

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
          <AppText variant="body" style={styles.text}>
            {message}
          </AppText>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: colors.raised,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    bottom: 90,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'absolute',
    right: 20,
  },
  text: {
    color: colors.chalk,
  },
});
