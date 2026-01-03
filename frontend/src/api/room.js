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
export const createRoom = async (roomData) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
    });
    return res;
};
export const deleteRoom = async (createdBy, roomId) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/delete/${roomId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            createdBy
        })
    });
    return res;
};
export const getRoomMessages = async (roomId) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/${roomId}/messages`);
    return res;
};
