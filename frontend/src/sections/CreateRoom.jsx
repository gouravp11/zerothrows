import Button from "../components/Button";
import Modal from "../components/Modal";
import CreateRoomForm from "../components/CreateRoomForm";
import { emitChatMessage, emitJoinRoom } from "../sockets/room.emits";
import { useContext } from "react";
import { RoomContext } from "../context/Room";
import { MockContext } from "../context/Mock";

// fetchRooms

const CreateRoom = ({ showCreateForm, setShowCreateForm }) => {
    // const handleCreateRoom = (roomData) => {
    //     setShowCreateForm(false);
    //     // fetchRooms();
    //     emitJoinRoom(roomData._id);
    //     emitChatMessage(roomData._id, "System", `${currentUser.riotId.gameName} joined the room`);
    // };
    return (
        <>
            <Button
                onClick={() => setShowCreateForm(true)}
                className="text-xl font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded shadow cursor-pointer"
            >
                + Create Room
            </Button>

            {showCreateForm && (
                <Modal onClose={() => setShowCreateForm(false)}>
                    <CreateRoomForm setShowCreateForm={setShowCreateForm} />
                </Modal>
            )}
        </>
    );
};

export default CreateRoom;
