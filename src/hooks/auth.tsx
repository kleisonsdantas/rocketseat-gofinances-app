import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface IUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}
interface IAuthContextData {
  user: IUser;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState({} as IUser);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const signInWithGoogle = useCallback(async() => {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const {type, params} = await AuthSession.startAsync({ authUrl }) as unknown as AuthorizationResponse;

      if(type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);

        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }, [])

  const signInWithApple = useCallback(async() => {
    try {

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if(credential){
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name: credential.fullName!.givenName!,
          photo: undefined,
        };

        setUser(userLogged);

        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged))
      }

    } catch (error: any) {
      throw new Error(error);
    }
  }, [])

  const signOut = useCallback(async () => {
    setUser({} as IUser);

    await AsyncStorage.removeItem('@gofinances:user');
  }, [])

  const value = useMemo(() => ({
    user,
    userStorageLoading,
    signInWithGoogle,
    signInWithApple,
    signOut
  }), [
    user,
    userStorageLoading,
    signInWithGoogle,
    signInWithApple,
    signOut
  ]);

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem('@gofinances:user');

      if(userStorage) {
        setUser( JSON.parse(userStorage));
      }

      setUserStorageLoading(false);
    }

    loadUserStorageData();
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
