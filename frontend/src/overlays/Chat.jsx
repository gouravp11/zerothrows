import Modal from "../components/Modal";
import ChatInterface from "../components/ChatInterface";
import { useContext } from "react";
import { RoomContext } from "../context/Room";

const Chat = ({ isChatOpen, setIsChatOpen }) => {
    const { activeRoom } = useContext(RoomContext);

    return (
        <>
            {isChatOpen && activeRoom && (
                <Modal onClose={() => setIsChatOpen(false)}>
                    <ChatInterface setIsChatOpen={setIsChatOpen} />
                </Modal>
            )}
        </>
    );
};

export default Chat;
