import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

import {
  Container,
  ImageContainer,
  TextLabel,
} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>
}

const SignInSocialButton: React.FC<Props> = ({title, svg: Svg, ...rest}) => {
  return (
    <Container {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>

      <TextLabel>
        {title}
      </TextLabel>
    </Container>
  );
}

export { SignInSocialButton };
