const mongoose = require("mongoose");
const faker = require("faker");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const connectDB = require("../config/db");
const Follow = require("../models/followModel");

connectDB();

const createFakeData = async () => {
  try {
    // Limpiar las colecciones existentes de ser necesario
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    const users = [];

    // Crear usuarios ficticios
    for (let i = 0; i < 3; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "qweqwe",
      });

      await user.save();
      users.push(user);

      let postsForUser = [];

      // Para cada usuario, crear posts ficticios
      for (let j = 0; j < 2; j++) {
        const post = new Post({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          image: "https://coffee.alexflipnote.dev/random",
          user: user._id,
          comments: [],
          likes: [],
        });

        const savedPost = await post.save();

        postsForUser.push(savedPost._id);

        await User.findByIdAndUpdate(user._id, {
          $set: { posts: postsForUser },
        });

        let commentsForPost = [];

        // Para cada post, crear comentarios ficticios
        for (let k = 0; k < 2; k++) {
          const comment = new Comment({
            text: faker.lorem.sentence(),
            user: user._id,
            post: post._id,
          });

          const savedComment = await comment.save(); // Guardar el comentario y asignarlo a una variable
          commentsForPost.push(savedComment._id);
        }

        await Post.findByIdAndUpdate(post._id, {
          $set: { comments: commentsForPost },
        });
      }
    }

    // Crear relaciones de seguimiento ficticias
    for (let i = 0; i < users.length; i++) {
      let followedUsers = []; // Registro de usuarios ya seguidos por el usuario actual

      // Hacer que cada usuario siga hasta 3 usuarios al azar, evitando duplicados
      for (let j = 0; j < 3; j++) {
        let followingIndex = faker.datatype.number({
          min: 0,
          max: users.length - 1,
        });

        // Evitar que el usuario se siga a sí mismo y evitar duplicados
        while (followingIndex === i || followedUsers.includes(followingIndex)) {
          followingIndex = faker.datatype.number({
            min: 0,
            max: users.length - 1,
          });
        }

        followedUsers.push(followingIndex); // Añadir el índice del usuario seguido al registro

        const follow = new Follow({
          followerId: users[i]._id,
          followingId: users[followingIndex]._id,
        });

        await follow.save();
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createFakeData();
