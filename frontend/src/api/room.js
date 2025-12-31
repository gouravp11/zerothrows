import { BACKEND_URL } from "../config";

export const fetchAllRooms = async (puuid) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms`, {
        headers: {
            "X-User-Puuid": puuid
        }
    });
    return res;
};
export const joinRoom = async (roomId, participant) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/join/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            participant
        })
    });
    return res;
};
export const leaveRoom = async (roomId, puuid) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/leave/${roomId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ puuid })
    });
    return res;
};
