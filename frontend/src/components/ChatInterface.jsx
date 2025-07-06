const ChatInterface = ({ room }) => (
  <div className="flex flex-col w-[600px] max-w-full h-[600px] max-h-[90vh]">
    <h2 className="text-xl font-bold mb-4">
      Chat - {room.roomName} ({room.region})
    </h2>

    <div className="flex-1 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
      {/* Example static messages; replace with real-time messages */}
      <div className="mb-2 text-sm text-gray-800">
        <span className="font-semibold">System:</span> Welcome to the chat!
      </div>
      <div className="mb-2 text-sm text-gray-800">
        <span className="font-semibold">{room.createdBy?.gameName}:</span> Let’s get ready!
      </div>
    </div>

    <div className="flex">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 border p-2 rounded-l focus:outline-none"
      />
      <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
        Send
      </button>
    </div>
  </div>
);

export default ChatInterface;
