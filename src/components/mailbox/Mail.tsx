import React, { useEffect } from "react";
import { connect } from "react-redux";
import { deactiveConversation } from "services/redux/message/actions";
import MailList from "./MailList";

interface IProps {
  toSource?: string;
  toId?: string;
  activeConversation?: any;
  deactiveConversation: Function;
  params: any;
}
const Mail = ({
  toSource,
  toId,
  params,
  deactiveConversation: handleDeactive,
}: IProps) => {
  useEffect(() => {
    if (!toSource && !toId) {
      handleDeactive();
    }
  }, []);

  return <MailList toSource={toSource} toId={toId} />;
};
const mapStates = (state: any) => {
  const { activeConversation } = state.conversation;
  return {
    activeConversation,
  };
};

const mapDispatch = { deactiveConversation };
export default connect(mapStates, mapDispatch)(Mail);
