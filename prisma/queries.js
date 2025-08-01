import prisma from './prisma.js';

const getUserByUsername = async username => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

const getUserById = async id => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const createUser = async (firstName, lastName, email, password) => {
  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      username: email,
      password,
    },
  });
};

const uploadFile = async filename => {
  return await prisma.file.create({
    data: {
      filename
    }
  })
};

export { getUserByUsername, getUserById, createUser, uploadFile };
