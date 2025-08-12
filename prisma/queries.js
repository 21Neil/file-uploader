import prisma from './prisma.js';

export const getUserByUsername = async username => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const getUserById = async id => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
    include: {
      folder: {
        where: {
          parentFolderId: null,
        },
        select: {
          id: true,
        },
      },
    },
  });
};

export const createUser = async (firstName, lastName, email, password) => {
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

export const uploadFile = async (filename, folderId) => {
  return await prisma.file.create({
    data: {
      filename,
      folderId,
    },
  });
};

export const getFolderById = async (id, userId) => {
  return await prisma.folder.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      subFolders: true,
      items: true,
    },
  });
};

export const createFolder = async (name, userId, parentFolderId) => {
  return await prisma.folder.create({
    data: {
      name,
      userId,
      parentFolderId,
    },
  });
};

export const getFolderParentIdById = async id => {
  return await prisma.folder.findUnique({
    where: {
      id,
    },
    select: {
      parentFolderId: true,
    },
  });
};

export const updateFolderNameById = async (id, name) => {
  await prisma.folder.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const deleteFolderById = async id => {
  await prisma.folder.delete({
    where: {
      id,
    },
  });
};

export const deleteItemById = async id => {
  await prisma.file.delete({
    where: {
      id,
    },
  });
};
