import socket from "./socket";

export const emitJoinRoom = (roomId) => {
    socket.emit("joinRoom", roomId);
};

export const emitLeaveRoom = (roomId) => {
    socket.emit("leaveRoom", roomId);
};

export const emitChatMessage = (roomId, sender, message) => {
    socket.emit("chatMessage", {
        roomId,
        sender,
        message
    });
};

export const emitRequestLeaveRoom = (roomId) => {
    socket.emit("requestLeaveRoom", roomId);
};
