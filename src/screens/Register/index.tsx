import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";

import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm';

import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';



interface FormData {
  [name: string]: string;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório'),
  amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Valor obrigatório')
})

const Register: React.FC = () => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [ category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const [ transactionType, setTransactionType ] = useState('');
  const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);



  const handleTransactionTypeSelect = useCallback((type: string) => {
    setTransactionType(type);
  }, [])

  const handleCloseSelectCategoryModal = useCallback(() => {
    setCategoryModalOpen(false);
  }, [])

  const handleOpenSelectCategoryModal = useCallback(() => {
    setCategoryModalOpen(true);
  }, [])

  const handleRegister = useCallback(async (form: FormData) => {
    if(!transactionType) {
      return Alert.alert('Selecione o tipo de transação');
    }

    if(category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }

    const data = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const dataKey = '@gofinances:transactions';

      const storageData = await AsyncStorage.getItem(dataKey);
      const currentData = storageData ? JSON.parse(storageData) : [];

      await AsyncStorage.setItem(dataKey, JSON.stringify([...currentData, data]));

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      })

      reset();

      navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }, [category, transactionType, navigate])



  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name='name'
              control={control}
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name='amount'
              control={control}
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionsTypes>
              <TransactionTypeButton
                type='up'
                title='Income'
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypeSelect('positive')}
              />
              <TransactionTypeButton
                type='down'
                title='Outcome'
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypeSelect('negative')}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />

          </Fields>

          <Button
            title='Enviar'
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal
          visible={categoryModalOpen}
        >
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export { Register };
