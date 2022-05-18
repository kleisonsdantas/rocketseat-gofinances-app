import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AnyStyledComponent } from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(TouchableOpacity as unknown as AnyStyledComponent)`
  height: ${RFValue(56)}px;

  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.shape};

  border-radius: 5px;
  margin-bottom: 16px;
`;

export const ImageContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;

  padding: ${RFValue(16)}px;

  border-color: ${({ theme }) => theme.colors.background};
  border-right-width: 1px;
`;

export const TextLabel = styled.Text`
  flex: 1;
  text-align: center;

  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;

`;
