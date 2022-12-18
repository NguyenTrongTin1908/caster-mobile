import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Box, Heading, View, Text, FlatList, Modal } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { postCategoryService } from "../../services/post-category.service";
import { postService } from "../../services";
import styles from "./style";

interface IProps {
  user: IPerformer;
}
const Help = ({ user }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [pagination, setPagination] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [firstCategory, setFirstCategory] = useState({} as any);
  const [firstTopic, setFirstTopic] = useState({} as any);
  const [limit, setLimit] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(null as any);
  const [topics, setTopics] = useState([] as any);
  const [filter, setFilter] = useState({
    sortBy: "ordering",
    sort: "asc",
  } as any);

  useEffect(() => {
    getCategory();
  }, []);

  let fstCategory;

  const renderItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listCategory}
          onPress={() =>
            handleModalTopic("post", item.slug, item.title, item._id)
          }
        >
          <Text style={styles.textCategory}>{item.title}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderTopic = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listCategory}
          onPress={() =>
            navigation.navigate("Detail", {
              categoryId: item.categoryIds[0],
              slugTitle: item.slug,
            })
          }
        >
          <Text style={styles.textCategory}>{item.title}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const handleModalTopic = async (
    type: string,
    slug: string,
    title: string,
    categoryIds: string
  ) => {
    let firstTopic;

    try {
      setLoading(true);
      const resp = await postService.search({
        slug,
        categoryIds,
        ...filter,
        limit,
      });
      if (resp.data.data && resp.data.data.length > 0) {
        firstTopic = resp.data.data.shift();
      }
      setLoading(false);
      setCategory(title);
      setTopics(resp.data.data);
      setFirstTopic(firstTopic);
      setModalVisible(true);
    } catch (e) {}
  };
  const getCategory = async (page = 1) => {
    try {
      const resp = await postCategoryService.search({
        ...filter,
        limit,
        offset: page - 1,
      });

      if (resp.data.data && resp.data.data.length > 0) {
        fstCategory = resp.data.data.shift();
      }

      setCategories(resp.data.data);
      setFirstCategory(fstCategory);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit,
      });
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={36}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Help
        </Heading>
        <TouchableOpacity
          style={styles.firstCategory}
          onPress={() =>
            handleModalTopic(
              "post",
              firstCategory.slug,
              firstCategory.title,
              firstCategory._id
            )
          }
        >
          <Text style={styles.textCategory}>{firstCategory.title}</Text>
        </TouchableOpacity>
        <FlatList
          keyExtractor={(item) => item._id}
          data={categories}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          numColumns={2}
          onEndReachedThreshold={0.5}
          // onEndReached={() => handleGetmore()}
          // ListEmptyComponent={renderEmpty()}
          // inverted
          // contentContainerStyle={{
          //   flexDirection: "column",
          // }}
        />
        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          avoidKeyboard
          justifyContent="center"
          size="full"
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>{category}</Modal.Header>
            <Modal.Body>
              <TouchableOpacity
                style={styles.listCategory}
                onPress={() =>
                  navigation.navigate("Detail", {
                    categoryId: firstTopic.categoryIds[0],
                    slugTitle: firstTopic.slug,
                  })
                }
              >
                <Text style={styles.textCategory}>{firstTopic.title}</Text>
              </TouchableOpacity>

              <FlatList
                keyExtractor={(item) => item._id}
                data={topics}
                renderItem={renderTopic}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                numColumns={2}
                onEndReachedThreshold={0.5}
                // onEndReached={() => handleGetmore()}
                // ListEmptyComponent={renderEmpty()}
                // inverted
                // contentContainerStyle={{
                //   flexDirection: "column",
                // }}
              />
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Help);
