import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { SectionView, CommonFilterRow, ColorFilter } from "./filterViews";
import { data } from "@/constants/data";

const FilterModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  onClose: any;
  onApply: any;
  onReset: any;
  filters: any;
  setFilters: any;
}) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let title = capitalize(sectionName);
            let sectionData = data.filters[sectionName];
            return (
              <Animated.View
                entering={FadeInDown.delay(100 * index + 100)
                  .springify()
                  .damping(11)}
                key={sectionName}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          {/* {Object.entries(sections).map(([key, Section]) => (
            <Section key={key} title={key}>
              <Text>Content</Text>
            </Section>
          ))} */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.buttons}
          >
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: theme.colors.neutral(0.9),
                  },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable style={[styles.applyButton]} onPress={onApply}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: theme.colors.white,
                  },
                ]}
              >
                Appy
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({
  animatedIndex,
  style,
}: {
  animatedIndex: SharedValue<number>;
  style: any;
}) => {
  const containerAnimated = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimated,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.simibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  applyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.colors.neutral(0.8),

    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  resetButton: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.colors.neutral(0.03),
    borderWidth: 2,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    borderColor: theme.colors.grayBG,
  },
  buttonText: {
    fontSize: hp(2.2),
    // fontWeight: theme.fontWeights.medium,
  },
});

export default FilterModal;
