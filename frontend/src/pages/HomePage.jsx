import { useState, useEffect, useContext } from "react";
import Navbar from "../sections/Navbar";
import CreateRoom from "../sections/CreateRoom";
import MyRoom from "../sections/MyRoom";
import JoinedRoom from "../sections/JoinedRoom";
import BrowseRooms from "../sections/BrowseRooms";
import Chat from "../overlays/Chat";
import { emitJoinRoom } from "../sockets/room.emits";
import { listenRoomUpdates } from "../sockets/room.listeners";
import { MockContext } from "../context/Mock";
import { RoomContext } from "../context/Room";

const HomePage = () => {
    const {currentUser} = useContext(MockContext);
    const {rooms, fetchRooms} = useContext(RoomContext);
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [regionFilter, setRegionFilter] = useState("ALL");
    const [isChatOpen, setIsChatOpen] = useState(false);

    const fetchRoomsAndJoin = async () => {
        const rooms = await fetchRooms();
        console.log(rooms);

        if (!rooms.length) return;

        const joinedRoom = rooms.find((room) =>
            room.participants?.some((p) => p.puuid === currentUser?.puuid)
        );

        if (joinedRoom) {
            emitJoinRoom(joinedRoom._id);
        }
    };

    const isInAnyRoom = rooms.some((room) =>
        room.participants?.some((p) => p.puuid === currentUser.puuid)
    );

    useEffect(() => {
        fetchRoomsAndJoin();
        const stopListenRoomUpdates = listenRoomUpdates(fetchRooms);

        return () => {
            stopListenRoomUpdates();
            // runs when homepage unmounts, reloads etc (Basically focused out)
        };
    }, []);

    return (
        <>
            <Navbar />

            <div className="px-4 py-6 max-w-4xl mx-auto space-y-12">
                <CreateRoom
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                />

                <MyRoom
                    setIsChatOpen={setIsChatOpen}
                />

                <JoinedRoom
                    setIsChatOpen={setIsChatOpen}
                />

                <BrowseRooms
                    regionFilter={regionFilter}
                    setRegionFilter={setRegionFilter}
                    isInAnyRoom={isInAnyRoom}
                />

                <Chat
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                />
            </div>
        </>
    );
};

export default HomePage;
