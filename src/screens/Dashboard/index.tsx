import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { HighLightCard } from '../../components/HighLightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expensive: HighLightProps;
    total: HighLightProps;
}
const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { signOut, user } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [highLightData, setHighLightData ] = useState<HighLightData>({} as HighLightData);
  const [transactions, setTransactions]  = useState<DataListProps[]>([]);

  const getLastTransactionDate = useCallback((
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ): any => {
    const collectionFiltered = collection
    .filter((transaction) => transaction.type === type);

    if(collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransactionDate =  Math.max.apply(Math, collectionFiltered
      .map((transaction) => new Date(transaction.date).getTime()));

    return Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
    }).format(new Date(lastTransactionDate));
  },[]);

  const loadTransactions = useCallback(async () => {
    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensiveTotal = 0;

      const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

        if(item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          ...item,
          amount,
          date,
        }
      });

      const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensive = getLastTransactionDate(transactions, 'positive');

      const total = entriesTotal - expensiveTotal;

      setHighLightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionEntries === 0
          ? "Não há transações"
          : `Última entrada dia ${lastTransactionEntries}`,
        },
        expensive: {
          amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionExpensive === 0
          ? "Não há transações"
          : `Última saída dia ${lastTransactionExpensive}`,
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionExpensive === 0
          ? "Não há transações"
          : `01 à ${lastTransactionExpensive}`,
        },
      })

      setTransactions(transactionsFormatted);

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingData(false);
    }
  }, []);



  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []))

  return (
    <Container>
      {
        isLoadingData ?
        <LoadContainer>
          <ActivityIndicator
            size={'large'}
            color={theme.colors.primary}
          />
        </LoadContainer>
        :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{uri: user.photo || `https://ui-avatars.com/api/?name=${user.name}&length=1`}}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton
                onPress={signOut}
              >
                <Icon name='power'/>
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighLightCards>
            <HighLightCard
              type='up'
              title='Entradas'
              amount={highLightData?.entries?.amount || 'R$ 0,00'}
              lastTransaction={highLightData?.entries?.lastTransaction}
            />
            <HighLightCard
              type='down'
              title='Saídas'
              amount={highLightData?.expensive?.amount || 'R$ 0,00'}
              lastTransaction={highLightData?.expensive?.lastTransaction}
            />
            <HighLightCard
              type='total'
              title='Total'
              amount={highLightData?.total?.amount || 'R$ 0,00'}
              lastTransaction={highLightData?.total?.lastTransaction}
            />
          </HighLightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />

          </Transactions>
        </>
      }
    </Container>
  );
}

export { Dashboard };
