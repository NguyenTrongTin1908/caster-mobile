import { Row, Checkbox, Button, Image, Alert, View } from "native-base";
import React, { useState, useEffect } from "react";
import { giftService } from "services/index";
import styles from "./style";
import { tokenTransctionService } from "services/index";

interface IProps {
  performerId: string;
  conversationId: string;
  saveFavorite: Function;
  favorGift: any;
}
const GiftPage = ({ performerId, conversationId, saveFavorite, favorGift }) => {
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const [token, setToken] = useState(0);
  const [giftFavorite, setGiftFavorite] = useState([] as any);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isSave, setIsSave] = useState(false);
  const [giftID, setGiftID] = useState("");
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    search();
  }, []);

  const handleSendGift = async (giftId: string) => {
    if (isConfirm) {
      try {
        await tokenTransctionService.sendGift(performerId, {
          giftId,
          conversationId,
          streamType: "",
          sessionId: "",
        });
        Alert("Send gift success");
      } catch (e: any) {
        const error = await e;

        error?.message[0] === "giftId should not be empty"
          ? Alert("Please select a gift")
          : Alert(error.message);
      }
    } else {
      Alert("Please confirm before send gift !! ");
    }
  };

  const cbChange = () => {
    setIsConfirm(!isConfirm);
  };

  const saveAsFavorite = () => {
    setIsSave(!isSave);
    if (!isSave) {
      saveFavorite(giftFavorite);
    }
  };

  const search = async () => {
    try {
      const resp = await giftService.search();

      setList(resp.data.data);
    } catch (e: any) {
      const error = await e;
      Alert(error.message || "Something went wrong, please try again later");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: true,
  };

  return (
    <View></View>

  );
};

export default GiftPage;
