/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useToast, Checkbox, Image } from "native-base";
import React, { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { padding } from "src/utils/theme";
import { tokenTransctionService } from "../../services";

interface IProps {
  performerId: string;
  conversationId: string;
  favorGift: any;
}
const FavoriteGift = ({ performerId, conversationId, favorGift }: IProps) => {
  const [isConfirm, setConfirm] = useState(true);
  const toast = useToast();
  console.log("Data : ", favorGift);

  const onChange = () => {
    setConfirm(!isConfirm);
  };

  const handleSendGift = async (giftId: string) => {
    if (isConfirm) {
      try {
        await tokenTransctionService.sendGift(performerId, {
          giftId,
          conversationId,
          streamType: "",
          sessionId: "",
        });
        toast.show({ description: "Send gift success" });
      } catch (e: any) {
        const error = await e;

        error.message === "giftId should not be empty"
          ? toast.show({ description: "Please select a gift" })
          : toast.show({ description: error.message });
      }
    } else {
      toast.show({ description: "Please confirm before send gift !! " });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleSendGift(favorGift?._id)}>
        {favorGift?.image && (
          <Image
            source={{ uri: favorGift?.image?.url || "" }}
            size={30}
            borderRadius={85}
            alt={""}
          />
        )}
      </TouchableOpacity>
      <View style={{ padding: 5 }}>
        <Checkbox
          aria-label="favorGift"
          isChecked={isConfirm}
          value={favorGift._id}
          onChange={onChange}
        />
      </View>
    </View>
  );
};

export default FavoriteGift;
