import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Box, Heading, Text, FlatList, Modal, View } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { postCategoryService } from "../../services/post-category.service";
import { postService } from "../../services";
import styles from "./style";
import BadgeText from "components/uis/BadgeText";

interface IProps {
  user: IPerformer;
}
const Help = ({ user }: IProps): React.ReactElement => {
  let fstCategory;
  const navigation = useNavigation() as any;
  const [pagination, setPagination] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [firstCategory, setFirstCategory] = useState(null as any);
  const [firstTopic, setFirstTopic] = useState({} as any);
  const [limit, setLimit] = useState(12);
  const [moreable, setMoreable] = useState(true);
  const [page, setPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectCategory, setSelectCategory] = useState(null as any);
  const [selectTopic, setSelectTopic] = useState(null as any);
  const [topics, setTopics] = useState([] as any);
  const [filter, setFilter] = useState({
    sortBy: "ordering",
    sort: "asc",
  } as any);

  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    handleModalTopic("post");
  }, [selectCategory]);
  useEffect(() => {
    if (selectTopic && selectCategory) {
      setSelectTopic(null);
      setSelectCategory(null);
      setModalVisible(false);
      navigation.navigate("Detail", {
        categoryId: selectTopic?.categoryIds[0],
        slugTitle: selectTopic?.slug,
      });
    }
  }, [selectTopic]);

  const renderItem = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listCategory}
          onPress={() => {
            setSelectCategory(item);
          }}
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
          onPress={() => {
            setSelectTopic(item);
          }}
        >
          <Text style={styles.textCategory}>{item.title}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const getCategory = async () => {
    try {
      const resp = await postCategoryService.search({
        ...filter,
        limit,
        offset: page,
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

  const loadMore = async (more = false, refresh = false) => {
    if (more && !moreable) return;

    try {
      setLoading(true);
      const newPage = more ? page + 1 : page;
      setPage(refresh ? 0 : newPage);
      const resp = await postCategoryService.search({
        ...filter,
        limit,
        offset: refresh ? 0 : newPage * limit,
      });
      if (!refresh && resp.data.data.length < limit) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }
      setLoading(false);
      setCategories(
        refresh ? resp.data.data : categories.concat(resp.data.data)
      );
    } catch (error) {}
  };

  const handleModalTopic = async (type: string) => {
    let firstTopic;
    if (!selectCategory) return;
    const { slug, _id, title } = selectCategory;
    try {
      setLoading(true);
      const resp = await postService.search({
        slug,
        categoryIds: _id,
        ...filter,
        limit,
      });
      if (resp.data.data && resp.data.data.length > 0) {
        firstTopic = resp.data.data.shift();
      }

      setLoading(false);
      setTopics(resp.data.data);
      setFirstTopic(firstTopic);
      setModalVisible(true);
    } catch (e) {}
  };

  // const loadMoreTopic = async (more = false, q = "", refresh = false) => {
  //   if (more && !moreable) return;
  //   try {
  //     setLoading(true);
  //     const newPage = more ? page + 1 : page;
  //     setPage(refresh ? 0 : newPage);
  //     const resp = await postCategoryService.search({
  //       ...filter,
  //       limit,
  //       offset: refresh ? 0 : newPage * limit,
  //     });
  //     const resp = await postService.search({
  //       slug,
  //       categoryIds,
  //       ...filter,
  //       limit,
  //     });
  //     if (!refresh && resp.data.length < limit) {
  //       setMoreable(false);
  //     }
  //     if (refresh && !moreable) {
  //       setMoreable(true);
  //     }
  //     setLoading(false);
  //     setCategories(refresh ? resp.data : categories.concat(resp.data));
  //   } catch (error) {}
  // };

  const renderEmpty = () => (
    <View>
      {!loading && !topics.length && (
        <BadgeText content={"There is no topic available!"} />
      )}
    </View>
  );

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
        {firstCategory && (
          <TouchableOpacity
            style={styles.firstCategory}
            onPress={() => setSelectCategory(firstCategory)}
          >
            <Text style={styles.textCategory}>{firstCategory.title}</Text>
          </TouchableOpacity>
        )}
        <FlatList
          keyExtractor={(item) => item._id}
          data={categories}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          numColumns={2}
          onEndReachedThreshold={0.5}
          onEndReached={() => loadMore(true, false)}
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
            <Modal.Header>{selectCategory?.title}</Modal.Header>
            <Modal.Body>
              {firstTopic && (
                <TouchableOpacity
                  style={styles.listCategory}
                  onPress={() => setSelectTopic(firstTopic)}
                >
                  <Text style={styles.textCategory}>{firstTopic.title}</Text>
                </TouchableOpacity>
              )}
              <FlatList
                keyExtractor={(item) => item._id}
                data={topics}
                renderItem={renderTopic}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                numColumns={2}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                ListEmptyComponent={renderEmpty}
                // onEndReached={() => loadMore(true, false)}
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
