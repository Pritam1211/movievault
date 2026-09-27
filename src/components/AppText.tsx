import { Text, type TextProps } from 'react-native';
import { typography, type TypographyVariant } from '../theme/typography';

type Props = TextProps & {
  variant?: TypographyVariant;
};

export function AppText({ variant = 'body', style, ...rest }: Props) {
  return <Text {...rest} style={[typography[variant], style]} />;
}
