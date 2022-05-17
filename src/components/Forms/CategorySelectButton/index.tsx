import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Container,
  Category,
  Icon,
} from './styles';

interface Props {
  title: string;
  onPress: () => void;
}

const CategorySelectButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <Container onPress={onPress}>
      <Category>
        {title}
      </Category>

      <Icon name='chevron-down'/>
    </Container>
  );
}

export { CategorySelectButton };
