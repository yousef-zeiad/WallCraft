import Categories from "@/components/categories";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SetStateAction, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef<TextInput>(null);
  const handleChangeCategory = (cat: SetStateAction<null>) => {
    setActiveCategory(cat);
  };
  console.log("activeCategory", activeCategory);
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>WallCraft</Text>
        </Pressable>
        <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          gap: 15,
        }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={22}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            onChangeText={(value) => setSearch(value)}
            placeholder="Search for Photos..."
            style={styles.searchInput}
            value={search}
            ref={searchInputRef}
          />
          {search && (
            <Pressable style={styles.closeIcon}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <Categories
          handleChangeCategory={handleChangeCategory}
          activeCategory={activeCategory}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    flexDirection: "row",
    marginHorizontal: wp(4),
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.simibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(4),
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    borderRadius: theme.radius.lg,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: hp(1.8),
    borderRadius: theme.radius.sm,
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
});

export default HomeScreen;
