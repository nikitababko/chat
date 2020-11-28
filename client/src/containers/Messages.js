import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Empty } from "antd";

import { messagesActions } from "redux/actions";
import socket from "core/socket";

import { Messages as BaseMessages } from "components";

const Dialogs = ({
    currentDialogId,
    fetchMessages,
    addMessage,
    items,
    user,
    isLoading,
    removeMessageById,
}) => {
    if (!currentDialogId) {
        return <Empty description="Откройте диалог" />;
    }

    const [previewImage, setPreviewImage] = useState(null);

    const messagesRef = useRef(null);

    const onNewMessage = (data) => {
        addMessage(data);
    };

    useEffect(() => {
        if (currentDialogId) {
            fetchMessages(currentDialogId);
        }

        socket.on("SERVER:NEW_MESSAGE", onNewMessage);

        return () => socket.removeListener("SERVER:NEW_MESSAGE", onNewMessage);
    }, [currentDialogId]);

    useEffect(() => {
        messagesRef.current.scrollTo(0, 999999);
    }, [items]);

    return (
        <BaseMessages
            user={user}
            blockRef={messagesRef}
            items={items}
            isLoading={isLoading && !user}
            onRemoveMessage={removeMessageById}
            setPreviewImage={setPreviewImage}
            previewImage={previewImage}
        />
    );
};

export default connect(
    ({ dialogs, messages, user }) => ({
        currentDialogId: dialogs.currentDialogId,
        items: messages.items,
        isLoading: messages.isLoading,
        user: user.data,
    }),
    messagesActions
)(Dialogs);
