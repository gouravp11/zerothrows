import React from "react";
import Modal from "../components/Modal";
import ChatInterface from "../components/ChatInterface";

const Chat = ({ isChatOpen, activeRoom, setIsChatOpen, handleLeaveRoom }) => {
    return (
        <>
            {isChatOpen && activeRoom && (
                <Modal onClose={() => setIsChatOpen(false)}>
                    <ChatInterface room={activeRoom} onLeaveRoom={handleLeaveRoom} />
                </Modal>
            )}
        </>
    );
};

export default Chat;
