import { apiCall } from "@/api";
import Categories from "@/components/categories";
import ImageGrid from "@/components/imageGrid";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { debounce, filter, set } from "lodash";
import FilterModal from "@/components/filterModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

let page;
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const searchInputRef = useRef<TextInput>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [isEndReached, setIsEndReached] = useState(false);
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async (params = { page: 1 }, append = false) => {
    let res = await apiCall(params);
    if (res.success && res.data?.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };
  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = { page, ...filters };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const resetFilters = () => {
    if (filters) {
      setFilters(null);
      page = 1;
      setImages([]);
      let params = { page };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = { page, ...filters };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };
  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
    page = 1;
    setImages([]);
    fetchImages({ page });
  };
  const handleDebounceSearch = useCallback(debounce(handleSearch, 400), []);
  const opeFilterModal = () => {
    modalRef.current?.present();
  };
  const closeFilterModal = () => {
    modalRef.current?.close();
  };
  const clearThisFilter = (filterName) => {
    let newFilters = { ...filters };
    delete newFilters[filterName];
    setFilters({ ...newFilters });
    page = 1;
    setImages([]);
    let params = { page, ...newFilters };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollY = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - layoutHeight;
    if (scrollY >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        ++page;
        let params = { page, ...filters };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, true);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };
  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollToTop}>
          <Text style={styles.title}>WallCraft</Text>
        </Pressable>
        <Pressable onPress={opeFilterModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
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
            onChangeText={handleDebounceSearch}
            placeholder="Search for Photos..."
            style={styles.searchInput}
            // value={search}
            ref={searchInputRef}
          />
          {search && (
            <Pressable style={styles.closeIcon} onPress={clearSearch}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.categories}>
          <Categories
            handleChangeCategory={handleChangeCategory}
            activeCategory={activeCategory}
          />
        </View>
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((filter, index) => {
                return (
                  <View key={filter} style={styles.filterItem}>
                    {filter == "colors" ? (
                      <View
                        style={{
                          width: 30,
                          height: 20,
                          borderRadius: 7,
                          backgroundColor: filters[filter],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterItemText}>
                        {filters[filter]}
                      </Text>
                    )}
                    <Pressable
                      onPress={() => {
                        clearThisFilter(filter);
                      }}
                      style={styles.filterCloseIcon}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
        <View
          style={{
            marginTop: images.length > 0 ? 10 : 70,
            marginBottom: 70,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      <FilterModal
        modalRef={modalRef}
        onApply={applyFilters}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        onClose={closeFilterModal}
      />
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
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 10,
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,

    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    padding: 4,
    borderRadius: 7,
    backgroundColor: theme.colors.neutral(0.2),
  },
});

export default HomeScreen;
