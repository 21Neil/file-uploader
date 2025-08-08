import { getFolderParentIdById } from "../prisma/queries.js";

export const getFolderPath = async (folderId) => {
  const pathSegments = [];
  let currentFolder = folderId

  while(currentFolder) {
    const folder = await getFolderParentIdById(currentFolder)
    
    pathSegments.unshift(currentFolder)
    currentFolder = folder.parentFolderId
  }

  return pathSegments.join('/')
}
