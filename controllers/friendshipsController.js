const FriendRequest = require("../models/friendRequestModel");
const Friendship = require("../models/friendshipModel");

const friendshipsController = {
  listFriends: async (req, res) => {
    const userId = req.user.id;
    try {
      const friendships = await Friendship.find({
        $or: [{ userOne: userId }, { userTwo: userId }]
      }).populate("userOne userTwo", "_id username"); // Sólo se recuperan el _id y el username
  
      const friendList = friendships.map((friendship) => {
        // Devuelve el amigo correcto con _id y username
        const friend = friendship.userOne._id.equals(userId) ? friendship.userTwo : friendship.userOne;
        return {
          id: friend._id,
          username: friend.username
        };
      });
  
      res.status(200).json({ friends: friendList });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la lista de amigos", error });
    }
  },
  

  removeFriend: async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user.id;

    try {
      const result = await Friendship.findOneAndDelete({
        $or: [
          { userOne: userId, userTwo: friendId },
          { userTwo: userId, userOne: friendId },
        ],
      });

      if (!result) {
        return res.status(404).json({ message: "Amistad no encontrada." });
      }
      await FriendRequest.deleteMany({
        $or: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      });

      res.status(200).json({ message: "Amistad eliminada." });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la amistad", error });
    }
  },
};


module.exports = friendshipsController