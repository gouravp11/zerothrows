import Button from "../components/Button";
import Modal from "../components/Modal";
import CreateRoomForm from "../components/CreateRoomForm";

const CreateRoom = ({ showCreateForm, setShowCreateForm }) => {
    return (
        <>
            <Button
                onClick={() => setShowCreateForm(true)}
                className="text-xl font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded shadow cursor-pointer"
            >
                + Create Room
            </Button>

            {showCreateForm && (
                <Modal onClose={() => setShowCreateForm(false)}>
                    <CreateRoomForm setShowCreateForm={setShowCreateForm} />
                </Modal>
            )}
        </>
    );
};

export default CreateRoom;
