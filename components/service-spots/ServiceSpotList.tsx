import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Dimensions } from "react-native";
import ServiceSpotListItem, {
  ServiceSpotListItemPressHandler,
} from "./ServiceSpotListItem";
import { Text, View } from "react-native-ui-lib";
import { ServiceSpot } from "../../apis/service-spots/type";

type Props = {
  items: ServiceSpot[];
  onItemPress?: ServiceSpotListItemPressHandler;
};

function ServiceSpotList({ items, onItemPress }: Props) {
  return items.length > 0 ? (
    <View
      style={{
        height: Dimensions.get("screen").height,
      }}
    >
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <ServiceSpotListItem serviceSpot={item} onPress={onItemPress} />
        )}
        estimatedItemSize={100}
      />
    </View>
  ) : (
    <View center marginV-20>
      <Text caption>ไม่พบวินมอเตอร์ไซค์ในบริเวณนี้</Text>
    </View>
  );
}

export default ServiceSpotList;
