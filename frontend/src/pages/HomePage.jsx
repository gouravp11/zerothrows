import { useState, useEffect, useContext } from "react";
import Navbar from "../sections/Navbar";
import CreateRoom from "../sections/CreateRoom";
import MyRoom from "../sections/MyRoom";
import JoinedRoom from "../sections/JoinedRoom";
import BrowseRooms from "../sections/BrowseRooms";
import Chat from "../overlays/Chat";
import {
    listenRoomCreated,
    listenRoomDeleted,
    listenRoomLeft,
    listenRoomJoined
} from "../sockets/room.listeners";
import { MockContext } from "../context/Mock";
import { RoomContext } from "../context/Room";

const HomePage = () => {
    const { currentUser } = useContext(MockContext);
    const {
        rooms,
        fetchRooms,
        handleRoomCreated,
        handleRoomDeleted,
        handleRoomJoined,
        handleRoomLeft
    } = useContext(RoomContext);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [regionFilter, setRegionFilter] = useState("ALL");
    const [isChatOpen, setIsChatOpen] = useState(false);

    const isInAnyRoom = rooms.some((room) =>
        room.participants?.some((p) => p.puuid === currentUser.puuid)
    );

    const onRoomCreated = (room) => {
        handleRoomCreated(room);
    };
    const onRoomDeleted = (room) => {
        handleRoomDeleted(room);
    };
    const onRoomJoined = (room) => {
        handleRoomJoined(room);
    };
    const onRoomLeft = (room) => {
        handleRoomLeft(room);
    };

    useEffect(() => {
        fetchRooms();
        const stopListenRoomCreated = listenRoomCreated(onRoomCreated);
        const stopListenRoomDeleted = listenRoomDeleted(onRoomDeleted);
        const stopListenRoomJoined = listenRoomJoined(onRoomJoined);
        const stopListenRoomLeft = listenRoomLeft(onRoomLeft);

        return () => {
            stopListenRoomCreated();
            stopListenRoomDeleted();
            stopListenRoomJoined();
            stopListenRoomLeft();
            // runs when homepage unmounts, reloads etc (Basically focused out)
        };
    }, []);

    return (
        <>
            <Navbar />

            <div className="px-4 py-6 max-w-4xl mx-auto space-y-12">
                <CreateRoom showCreateForm={showCreateForm} setShowCreateForm={setShowCreateForm} />

                <MyRoom setIsChatOpen={setIsChatOpen} />

                <JoinedRoom setIsChatOpen={setIsChatOpen} />

                <BrowseRooms
                    regionFilter={regionFilter}
                    setRegionFilter={setRegionFilter}
                    isInAnyRoom={isInAnyRoom}
                />

                <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
            </div>
        </>
    );
};

export default HomePage;
