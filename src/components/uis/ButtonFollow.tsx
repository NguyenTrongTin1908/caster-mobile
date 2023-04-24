import React, { useEffect, useState } from "react";
import { Box,  View, Button } from "native-base";
import { followService } from "services/follow.service";
import { onFollow } from 'services/redux/performer/actions';
import { connect } from "react-redux";


interface IProps {
  isFollow: boolean;
  targetId: string;
  sourceId: string;
  getPerformerList: Function;
  isHideOnClick: boolean;
  onFollow: Function;
}

const ButtonFollow = ({
  isFollow,
  targetId,
  sourceId,
  getPerformerList,
  onFollow: dispatchOnFollow,
  isHideOnClick,
}: IProps): React.ReactElement => {
  const [status, setStatus] = useState(false);
  const [loading, setLoanding] = useState(false);

  useEffect(() => {
    if (isFollow || isFollow === undefined) {
      setStatus(true);
    }
  }, []);

  const handleFollow = async () => {
    try {
      if (status) {
       setLoanding(true);
        await followService.delete(targetId);
        setStatus(false);
        dispatchOnFollow
        && dispatchOnFollow({
          action: 'delete',
          performerId: targetId
        });
      } else {
        setLoanding(true);
        await followService.create({
          targetId,
          sourceId,
        });
        setStatus(true);
        dispatchOnFollow && dispatchOnFollow({
          action: 'create',
          performerId: targetId
        });
        getPerformerList();
      }
    } catch (e) {
      const err = await e;
    } finally {
      setLoanding(false);
    }
  };

  return (
    <View>
      {status && isHideOnClick ? null : (
        <Button
          width={60}
          height={10}
          size={18}
          colorScheme="secondary"
          onPress={handleFollow}
        >
          {status ? "Unfollow" : "Follow"}
        </Button>
      )}
    </View>
  );
};

const mapDispatch = {
  onFollow
};


export default connect(null,mapDispatch)(ButtonFollow);
