import { useContext } from "react";
import RoomCard from "../components/RoomCard";
import { RoomContext } from "../context/Room";
import { MockContext } from "../context/Mock";

const BrowseRooms = ({ regionFilter, setRegionFilter, isInAnyRoom }) => {
    const { rooms, joinedRoom } = useContext(RoomContext);
    const { currentUser } = useContext(MockContext);

    const otherRooms = rooms.filter(
        (room) =>
            room.createdBy?.puuid !== currentUser.puuid &&
            room._id !== joinedRoom?._id &&
            (regionFilter === "ALL" || room.region === regionFilter)
    );

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
                        isInAnyRoom={isInAnyRoom}
                    />
                ))
            ) : (
                <p className="text-gray-500">No rooms found in this region.</p>
            )}
        </section>
    );
};

export default BrowseRooms;
