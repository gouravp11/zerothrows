import { useContext, useEffect } from "react";
import Button from "./Button";
import { listenLeaveRoomAll } from "../sockets/room.listeners";
import { MockContext } from "../context/Mock";
import { RoomContext } from "../context/Room";
// currentUserPuuid, onGoChat, onDelete, onJoin, onLeave
// new -> setIsChatOpen
const RoomCard = ({ room, isOwnRoom, onForceClose, isInAnyRoom, setIsChatOpen }) => {
    const MockContextValue = useContext(MockContext);
    const { currentUser } = MockContextValue;
    const RoomContextValue = useContext(RoomContext);
    const { handleGoChat, handleLeaveRoom, handleJoinRoom, handleDeleteRoom, handleLeaveRoomAll } =
        RoomContextValue;
    const isParticipant = room.participants?.some((p) => p.puuid === currentUser.puuid);

    const onGoChat = (room) => {
        setIsChatOpen(true);
        handleGoChat(room);
    };
    const onLeave = (roomId) => {
        handleLeaveRoom(roomId);
    };
    const onJoin = (roomId) => {
        handleJoinRoom(roomId);
    };
    const onDelete = (roomId) => {
        handleDeleteRoom(roomId);
    };
    const onLeaveRoomAll = (roomId) => {
        // roomId would be passed by the server's .emit
        handleLeaveRoomAll(roomId);
        if (!isOwnRoom) {
            alert("Room has been deleted by the owner");
            onForceClose?.();
        }
    };

    useEffect(() => {
        const stopListenLeaveRoomAll = listenLeaveRoomAll(onLeaveRoomAll);
        return () => stopListenLeaveRoomAll();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-5 mb-6 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-xl font-bold text-indigo-700 mb-1">{room.roomName}</h3>
                    <p className="text-sm text-gray-600">
                        Created by:{" "}
                        <span className="font-medium text-gray-800">
                            {room.createdBy?.gameName}#{room.createdBy?.tagLine}
                        </span>
                    </p>
                </div>
                <div className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                    {room.region}
                </div>
            </div>

            <p className="text-gray-700 text-sm italic mb-3">
                {room.description || "No description provided."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                <div className="bg-gray-100 px-3 py-2 rounded">
                    <strong className="text-gray-800">Min Rank:</strong>{" "}
                    {room.requirements?.minRank || "N/A"}
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded">
                    <strong className="text-gray-800">Min Peak Rank:</strong>{" "}
                    {room.requirements?.minPeakRank || "N/A"}
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded">
                    <strong className="text-gray-800">Participants:</strong>{" "}
                    {room.participants?.length || 0} / 5
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
                {isOwnRoom ? (
                    <>
                        <Button
                            onClick={() => onDelete(room._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Delete Room
                        </Button>
                        <Button
                            onClick={() => onGoChat(room)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Go to Chat
                        </Button>
                    </>
                ) : isParticipant ? (
                    <>
                        <Button
                            onClick={() => onGoChat(room)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Go to Chat
                        </Button>
                        <Button
                            onClick={() => onLeave(room._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Leave Room
                        </Button>
                    </>
                ) : room.participants?.length >= 5 ? (
                    <Button
                        disabled
                        className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    >
                        Room Full
                    </Button>
                ) : isInAnyRoom ? (
                    <Button
                        disabled
                        className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    >
                        Already in Room
                    </Button>
                ) : (
                    <Button
                        onClick={() => onJoin(room._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                        Join Room
                    </Button>
                )}
            </div>
        </div>
    );
};

export default RoomCard;
