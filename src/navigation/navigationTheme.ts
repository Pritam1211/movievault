import { DarkTheme, type Theme } from '@react-navigation/native';
import { colors } from '../theme/colors';

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.bulb,
    background: colors.ink,
    card: colors.ink,
    text: colors.chalk,
    border: colors.line,
    notification: colors.alert,
  },
};
