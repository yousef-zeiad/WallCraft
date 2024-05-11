import { StyleSheet, Text, View } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { getColumnsCount, wp } from "@/helpers/common";

const ImageGrid = ({ images, router }: { images: any[]; router: any }) => {
  const columns = getColumnsCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => (
          <ImageCard
            router={router}
            index={index}
            item={item}
            columns={columns}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});
export default ImageGrid;
