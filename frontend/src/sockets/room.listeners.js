import socket from "./socket";

// export const listenRoomUpdates = (callback) => {
//     socket.on("roomUpdated", callback);
//     return () => socket.off("roomUpdated", callback);
// };

export const listenRoomCreated = (callback) => {
    socket.on("roomCreated", callback);
    return () => socket.off("roomCreated", callback);
};

export const listenRoomDeleted = (callback) => {
    socket.on("roomDeleted", callback);
    return () => socket.off("roomDeleted", callback);
};

export const listenRoomJoined = (callback) => {
    socket.on("roomJoined", callback);
    return () => socket.off("roomJoined", callback);
};

export const listenRoomLeft = (callback) => {
    socket.on("roomLeft", callback);
    return () => socket.off("roomLeft", callback);
};

export const listenLeaveRoomAll = (callback) => {
    socket.on("leaveRoomAll", callback);
    return () => socket.off("leaveRoomAll", callback);
};

export const listenChatMessage = (callback) => {
    socket.on("chatMessage", callback);
    return () => socket.off("chatMessage", callback);
};
