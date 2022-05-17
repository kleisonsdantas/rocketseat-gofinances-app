import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Content,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  ChartContainer,
  LoadContainer,
} from './styles';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  color: string;
  percent: string;
  total: number;
  totalFormatted: string;
}

const Resume: React.FC = () => {
  const theme = useTheme();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const handleChangeDate = useCallback((action: 'next' | 'prev') => {
    setSelectedDate(addMonths(selectedDate, action === 'next' ? 1 : -1));
  }, [selectedDate]);

  const loadTransactions = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      const expensive: TransactionData[] = transactions
        .filter((transaction: TransactionData) => transaction.type === 'negative'
          && new Date(transaction.date).getMonth() === selectedDate.getMonth()
          && new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
        );

      const expensiveTotal = expensive.reduce((accumulator, transaction) => {
        return accumulator + Number(transaction.amount);
      }, 0);

      const totalByCategory: CategoryData[] = [];

      categories.forEach(category => {
        let categorySum = 0;

        expensive.forEach(transaction => {
          if(transaction.category === category.key) {
            categorySum += Number(transaction.amount)
          }
        });


        if(categorySum > 0) {
          const total = categorySum
          .toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL',
          })

          const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`
          totalByCategory.push({
            key: category.key,
            name: category.name,
            color: category.color,
            percent,
            total: categorySum,
            totalFormatted: total,
          })
        }
      })

      setTotalByCategories(totalByCategory);

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedDate]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, [selectedDate]))

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoadingData ?
        <LoadContainer>
          <ActivityIndicator
            size={'large'}
            color={theme.colors.primary}
          />
        </LoadContainer>
        :
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle= {{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
          >
          <MonthSelect>
            <MonthSelectButton
              onPress={() => handleChangeDate('prev')}
              >
              <SelectIcon name='chevron-left'/>
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

            <MonthSelectButton
              onPress={() => handleChangeDate('next')}
              >
              <SelectIcon name='chevron-right'/>
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x='percent'
              y='total'
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={110}
              />
          </ChartContainer>

          { totalByCategories.map(item => (
            <HistoryCard
            key={item.key}
            color={item.color}
            amount={item.totalFormatted}
            title={item.name}
            />
            ))
          }
        </Content>
      }
    </Container>
  );
}

export { Resume };
