import RoomCard from "../components/RoomCard";
import { useContext } from "react";
import { RoomContext } from "../context/Room";
// myRoom, handleJoinRoom, isInAnyRoom, currentUser, handleGoChat
// new -> setIsChatOpen
const MyRoom = ({setIsChatOpen}) => {
    const roomContextValue = useContext(RoomContext);
    const {myRoom} = roomContextValue;

    // const handleDeleteRoom = async (roomId) => {
    //     try {
    //         emitRequestLeaveRoom(roomId);

    //         const createdBy = {
    //             gameName: currentUser.riotId.gameName,
    //             tagLine: currentUser.tagLine,
    //             puuid: currentUser.puuid
    //         };

    //         const res = await deleteRoom(createdBy, roomId);
    //         if (res.ok) {
    //             // console.log("Room deleted:", roomId);
    //             await fetchRooms();
    //         } else {
    //             const errorData = await res.json();
    //             alert(errorData.error || "Failed to delete room");
    //         }
    //     } catch (error) {
    //         console.error("Failed to delete room:", error);
    //     }
    // };
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
