import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { categories } from '../../utils/categories';

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface CategoryProps {
  key: string;
  name: string;
}

interface Props {
  category: CategoryProps;
  setCategory: (category: CategoryProps) => void;
  closeSelectCategory: () => void;
}

const CategorySelect: React.FC<Props> = ({
  category,
  setCategory,
  closeSelectCategory,
}) => {
  const handleCategorySelect = useCallback((category: CategoryProps) => {
    setCategory(category);
  }, [])

  return (
    <Container >
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) =>
          <Category
            isActive={category.key === item.key}
            onPress={() => handleCategorySelect(item)}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        }
        ItemSeparatorComponent={() => <Separator/>}
      />

      <Footer>
        <Button
          title='Selecionar'
          onPress={closeSelectCategory}
        />
      </Footer>
    </Container>
  );
}

export { CategorySelect };
