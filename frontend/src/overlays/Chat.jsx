import Modal from "../components/Modal";
import ChatInterface from "../components/ChatInterface";
import { useContext } from "react";
import { RoomContext } from "../context/Room";

// handleLeaveRoom, activeRoom
const Chat = ({ isChatOpen, setIsChatOpen }) => {
    const RoomContextValue = useContext(RoomContext);
    const {activeRoom} = RoomContextValue;
    return (
        <>
            {isChatOpen && activeRoom && (
                <Modal onClose={() => setIsChatOpen(false)}>
                    <ChatInterface setIsChatOpen={setIsChatOpen}/>
                </Modal>
            )}
        </>
    );
};

export default Chat;
