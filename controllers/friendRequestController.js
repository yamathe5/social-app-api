const FriendRequest = require("../models/friendRequestModel");
const Friendship = require("../models/friendshipModel");

const friendRequestController = {
  sendFriendRequest: async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (receiverId.toString() === senderId.toString()) {
      return res
        .status(400)
        .json({
          message: "No puedes enviarte una solicitud de amistad a ti mismo.",
        });
    }

    try {
      // Verificar si existe alguna solicitud en cualquier dirección y estado
      const existingRequest = await FriendRequest.findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId, status: "pending" },
          { senderId: senderId, receiverId: receiverId, status: "accepted" },
          { senderId: receiverId, receiverId: senderId, status: "pending" },
          { senderId: receiverId, receiverId: senderId, status: "accepted" },
        ],  
      });

      if (existingRequest) {
        return res.status(409).json({
          message: `Ya existe una solicitud de amistad ${existingRequest.status}.`,
        });
      }

      const newRequest = new FriendRequest({
        senderId,
        receiverId,
        status: "pending",
      });

      await newRequest.save();
      res
        .status(201)
        .json({ message: "Solicitud de amistad enviada.", newRequest });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al enviar solicitud de amistad", error });
    }
  },

  viewSentRequests: async (req, res) => {
    const senderId = req.user.id;

    try {
      const sentRequests = await FriendRequest.find({
        senderId,
        status: "pending",
      })
        .populate("receiverId", "username email")
        .select("status createdAt updatedAt");

      res.status(200).json({ sentRequests });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las solicitudes enviadas", error });
    }
  },

  viewReceivedRequests: async (req, res) => {
    const receiverId = req.user.id;

    try {
      const receivedRequests = await FriendRequest.find({
        receiverId,
        status: "pending",
      })
        .populate("senderId", "username email")
        .select("status createdAt updatedAt");

      res.status(200).json({ receivedRequests });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las solicitudes recibidas", error });
    }
  },

  acceptFriendRequest: async (req, res) => {
    const { requestId } = req.params;
    const myId = req.user.id;
    try {
      const request = await FriendRequest.findById(requestId);

      if (!request || request.status !== "pending") {
        return res
          .status(404)
          .json({ message: "Solicitud no encontrada o ya manejada." });
      }

      if (request.receiverId.toString() !== myId.toString()) {
        return res.status(403).json({ message: "No autorizado." });
      }

      request.status = "accepted";
      await request.save();
      // Crear la amistad en la colección Friendship si es necesario
      const existingFriendship = await Friendship.findOne({
        $or: [
          { userOne: myId, userTwo: request.senderId },
          { userOne: request.senderId, userTwo: myId },
        ],
      });
      if (!existingFriendship) {
        const newFriendship = new Friendship({
          userOne: request.senderId,
          userTwo: myId,
        });
        await newFriendship.save();
      }
      res.status(200).json({ message: "Solicitud de amistad aceptada." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al aceptar solicitud de amistad", error });
    }
  },

  cancelFriendRequest: async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user.id; // Suponiendo que el ID del usuario se guarda en req.user.id

    try {
      // Primero, encuentra la solicitud sin borrarla
      const request = await FriendRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Solicitud no encontrada." });
      }

      // Verifica si el usuario es el emisor o el receptor de la solicitud
      if (
        request.senderId.toString() !== userId &&
        request.receiverId.toString() !== userId
      ) {
        return res
          .status(403)
          .json({ message: "No autorizado para cancelar esta solicitud." });
      }

      // Si la comprobación es exitosa, procede a eliminar la solicitud
      await FriendRequest.findByIdAndDelete(requestId);
      res.status(200).json({ message: "Solicitud de amistad cancelada." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al cancelar la solicitud de amistad", error });
    }
  },
};
module.exports = friendRequestController;
