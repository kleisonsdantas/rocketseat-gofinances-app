import React, { useCallback,  useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignTitle,
  Footer,
  FooterWrapper,
} from './styles';

const SignIn: React.FC = () => {
  const theme  = useTheme();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSignWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);

      await signInWithGoogle();

    } catch (error: any) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    }
  }, [])

  const handleSignWithApple = useCallback(async () => {
    try {
      setIsLoading(true);

      await signInWithApple();

    } catch (error: any) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Apple');
      setIsLoading(false);
    }
  }, [])

  return (
    <Container >
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>

          <SignTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignTitle>
        </TitleWrapper>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title='Entrar com Google'
            svg={GoogleSvg}
            onPress={handleSignWithGoogle}
          />
          {Platform.OS === 'ios' &&
            <SignInSocialButton
              title='Entrar com Apple'
              svg={AppleSvg}
              onPress={handleSignWithApple}
            />
          }
        </FooterWrapper>

        {isLoading &&
          <ActivityIndicator
            style={{marginTop: 18}}
            color={theme.colors.shape}
          />
        }
      </Footer>
    </Container>
  );
}

export { SignIn };
