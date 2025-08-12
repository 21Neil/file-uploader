import { getFileById, getFolderParentIdById } from '../prisma/queries.js';

export const getFolderPath = async folderId => {
  const pathSegments = [];
  let currentFolder = folderId;

  while (currentFolder) {
    const folder = await getFolderParentIdById(currentFolder);

    pathSegments.unshift(currentFolder);
    currentFolder = folder.parentFolderId;
  }

  return pathSegments.join('/');
};

export const getFilePath = async fileId => {
  const file = await getFileById(fileId);
  const path = await getFolderPath(file.folderId);

  return `${path}/${file.filename}`;
};
