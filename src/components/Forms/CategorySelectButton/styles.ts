import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { AnyStyledComponent } from 'styled-components';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled(TouchableOpacity as unknown as AnyStyledComponent).attrs({
  activeOpacity: 0.7,
})`
  background-color: ${({ theme }) => theme.colors.shape};

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-radius: 5px;

  margin: 8px 0;
  padding: 18px 16px;
`;

export const Category = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

`;
export const Icon = styled(Feather as unknown as AnyStyledComponent)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};

`;
