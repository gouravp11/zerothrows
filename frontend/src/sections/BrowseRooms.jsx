import React from "react";
import RoomCard from "../components/RoomCard";

const BrowseRooms = ({
    otherRooms,
    regionFilter,
    setRegionFilter,
    handleJoinRoom,
    handleGoChat,
    isInAnyRoom,
    setIsChatOpen,
    currentUser
}) => {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Browse Rooms</h2>
                <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                >
                    <option value="ALL">All Regions</option>
                    <option value="NA">NA</option>
                    <option value="EMEA">EMEA</option>
                    <option value="APAC">APAC</option>
                    <option value="CN">CN</option>
                </select>
            </div>
            {otherRooms.length > 0 ? (
                otherRooms.map((room) => (
                    <RoomCard
                        key={room._id}
                        room={room}
                        isOwnRoom={false}
                        onJoin={handleJoinRoom}
                        onGoChat={handleGoChat}
                        isInAnyRoom={isInAnyRoom}
                        onForceClose={() => setIsChatOpen(false)}
                        currentUserPuuid={currentUser.puuid}
                    />
                ))
            ) : (
                <p className="text-gray-500">No rooms found in this region.</p>
            )}
        </section>
    );
};

export default BrowseRooms;
