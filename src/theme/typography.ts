import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  display: {
    color: colors.chalk,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  title: {
    color: colors.chalk,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  strong: {
    color: colors.chalk,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    color: colors.chalk,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  label: {
    color: colors.dim,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    color: colors.dim,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
  },
});

export type TypographyVariant = keyof typeof typography;
