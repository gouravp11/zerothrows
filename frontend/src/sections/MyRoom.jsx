import React from "react";
import RoomCard from "../components/RoomCard";
import socket from "../utils/socket";
import { deleteRoom } from "../api/room";

const MyRoom = ({ myRoom, handleJoinRoom, handleGoChat, isInAnyRoom, currentUser }) => {
    const handleDeleteRoom = async (roomId) => {
        try {
            socket.emit("requestLeaveRoom", roomId);

            const createdBy = {
                gameName: currentUser.riotId.gameName,
                tagLine: currentUser.tagLine,
                puuid: currentUser.puuid
            };

            const res = await deleteRoom(createdBy);
            if (res.ok) {
                // console.log("Room deleted:", roomId);
                await fetchRooms();
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to delete room");
            }
        } catch (error) {
            console.error("Failed to delete room:", error);
        }
    };
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-2">My Room</h2>
            {myRoom ? (
                <RoomCard
                    key={myRoom._id}
                    room={myRoom}
                    isOwnRoom={true}
                    onDelete={handleDeleteRoom}
                    onJoin={handleJoinRoom}
                    onGoChat={handleGoChat}
                    isInAnyRoom={isInAnyRoom}
                    currentUserPuuid={currentUser.puuid}
                />
            ) : (
                <p className="text-gray-500">You have not created any room.</p>
            )}
        </section>
    );
};

export default MyRoom;
