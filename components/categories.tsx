import { data } from "@/constants/data";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Categories = ({
  activeCategory,
  handleChangeCategory,
}: {
  activeCategory: any;
  handleChangeCategory: (cat: any) => void;
}) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item}
          index={index}
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
        />
      )}
    />
  );
};

const CategoryItem = ({
  title,
  index,
  isActive,
  handleChangeCategory,
}: {
  title: string;
  index: number;
  isActive: boolean;
  handleChangeCategory: (cat: any) => void;
}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;
  return (
    <View>
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    // backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
  },
});

export default Categories;
