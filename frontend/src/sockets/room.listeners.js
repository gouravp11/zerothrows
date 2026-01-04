import socket from "./socket";

export const listenRoomUpdates = (callback) => {
    socket.on("roomUpdated", callback);
    return () => socket.off("roomUpdated", callback);
};

export const listenLeaveRoomAll = (callback) => {
    socket.on("leaveRoomAll", callback);
    return () => socket.off("leaveRoomAll", callback);
};

export const listenChatMessage = (callback) => {
    socket.on("chatMessage", callback);
    return () => socket.off("chatMessage", callback);
};
