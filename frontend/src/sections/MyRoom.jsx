import RoomCard from "../components/RoomCard";
import { useContext } from "react";
import { RoomContext } from "../context/Room";

const MyRoom = ({setIsChatOpen}) => {
    const {myRoom} = useContext(RoomContext);
    
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-2">My Room</h2>
            {myRoom ? (
                <RoomCard
                    key={myRoom._id}
                    room={myRoom}
                    isOwnRoom={true}
                    setIsChatOpen={setIsChatOpen}
                />
            ) : (
                <p className="text-gray-500">You have not created any room.</p>
            )}
        </section>
    );
};

export default MyRoom;
