
import styled from 'styled-components/native';
import { AnyStyledComponent } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';


export const Container = styled(TouchableOpacity as unknown as AnyStyledComponent)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  padding: 18px;

  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.shape};
`;
