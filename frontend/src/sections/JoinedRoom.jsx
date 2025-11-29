import React from "react";
import RoomCard from "../components/RoomCard";

const JoinedRoom = ({
    joinedRoom,
    handleGoChat,
    handleLeaveRoom,
    isInAnyRoom,
    setIsChatOpen,
    currentUser
}) => {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-2">Other Joined Room</h2>
            {joinedRoom ? (
                <RoomCard
                    room={joinedRoom}
                    isOwnRoom={false}
                    onLeave={handleLeaveRoom}
                    onGoChat={handleGoChat}
                    isInAnyRoom={isInAnyRoom}
                    onForceClose={() => setIsChatOpen(false)}
                    currentUserPuuid={currentUser.puuid}
                />
            ) : (
                <p className="text-gray-500">You have not joined any other's room.</p>
            )}
        </section>
    );
};

export default JoinedRoom;
