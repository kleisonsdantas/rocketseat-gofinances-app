import styled, { css } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AnyStyledComponent } from 'styled-components';

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  width: 48%;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  border: 1.5px solid ${({ theme }) => theme.colors.text};
  border-radius: 5px;

  padding: 16px 35px;

  ${({ isActive, theme, type }) => isActive && css`
    background-color: ${type === 'up' ? theme.colors.success_light : theme.colors.attention_light};
    border: none;
  `};
`;

export const Icon = styled(Feather as unknown as AnyStyledComponent)<IconProps>`
  color: ${({ theme, type }) =>
    type === 'up' ? theme.colors.success : theme.colors.attention};

  font-size: ${RFValue(24)}px;

  margin-right: 12px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};

  font-size: ${RFValue(14)}px;
`;
