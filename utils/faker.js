// script para insertar datos ficticios (insertFakeData.js)
const mongoose = require("mongoose");
const faker = require("faker");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const connectDB = require("../config/db");

connectDB();

const createFakeData = async () => {
  try {
    // Limpiar las colecciones existentes de ser necesario
    // await User.deleteMany();
    // await Post.deleteMany();
    // await Comment.deleteMany();

    // Crear usuarios ficticios
    for (let i = 0; i < 10; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "password", 
      });

      await user.save();

      // Para cada usuario, crear posts ficticios
      for (let j = 0; j < 5; j++) {
        const post = new Post({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          user: user._id,
        });

        await post.save();

        // Para cada post, crear comentarios ficticios
        for (let k = 0; k < 3; k++) {
          const comment = new Comment({
            text: faker.lorem.sentence(),
            user: user._id,
            post: post._id,
          });

          await comment.save();
        }
      }
    }

    console.log("Datos ficticios insertados");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createFakeData();
