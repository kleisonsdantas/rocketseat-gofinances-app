import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Title,
} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<Props> = ({ title, onPress, ...rest }) => {
  return (
    <Container onPress={onPress} {...rest}>
      <Title>
        {title}
      </Title>
    </Container>
  );
}

export { Button };
