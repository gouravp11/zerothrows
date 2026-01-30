import { useContext } from "react";
import RoomCard from "../components/RoomCard";
import { RoomContext } from "../context/Room";

const JoinedRoom = ({ setIsChatOpen }) => {
    const { joinedRoom } = useContext(RoomContext);

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-2">Other Joined Room</h2>
            {joinedRoom ? (
                <RoomCard
                    room={joinedRoom}
                    isOwnRoom={false}
                    onForceClose={() => setIsChatOpen(false)}
                    setIsChatOpen={setIsChatOpen}
                />
            ) : (
                <p className="text-gray-500">You have not joined any other's room.</p>
            )}
        </section>
    );
};

export default JoinedRoom;
