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
    omit: {
      password: true,
    },
    include: {
      folder: {
        select: {
          id: true,
        },
      },
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
      folder: {
        create: {
          name: 'root',
        },
      },
    },
  });
};

const uploadFile = async (filename, folderId) => {
  return await prisma.file.create({
    data: {
      filename,
      folderId,
    },
  });
};

const getFolderById = async id => {
  return await prisma.folder.findUnique({
    where: {
      id,
    },
    include: {
      subFolders: true,
      items: true,
    },
  });
};

export {
  getUserByUsername,
  getUserById,
  createUser,
  uploadFile,
  getFolderById,
};
