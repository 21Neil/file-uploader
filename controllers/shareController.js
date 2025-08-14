import { getFolderPath } from '../lib/pathUtils.js';
import {
  createShareLink,
  getFolderById,
  getShareLink,
} from '../prisma/queries.js';

const getShareView = async (req, res) => {
  res.render('share', {
    title: 'Share',
    folderId: req.params.id,
  });
};

const createShareFolder = async (req, res, next) => {
  const folderId = parseInt(req.body.folderId);
  const duration = parseInt(req.body.duration);
  const now = new Date();
  const expiresAt = new Date(now.setDate(now.getDate() + duration));

  try {
    const shareLink = await createShareLink(folderId, expiresAt);
    const shareLinkId = shareLink.id;

    res.render('share', {
      title: 'Share',
      folderId: folderId,
      msg: `Share success! Link: ${req.protocol}://${req.get(
        'host'
      )}/share/${shareLinkId}`,
    });
  } catch (err) {
    next(err);
  }
};

const getShareFolderView = async (req, res, next) => {
  const { id } = req.params;
  try {
    const shareFolder = await getShareLink(id);
    const now = new Date();
    const isExpires = shareFolder.expiresAt.getTime() < now.getTime();

    if (isExpires) return res.status(404).send('Link expired!');

    const folder = await getFolderById(shareFolder.folderId);

    res.render('folder', {
      title: 'Shared folder',
      folderId: folder.id,
      folders: folder.subFolders,
      files: folder.items,
      shared: true,
      sharedLink: shareFolder.id,
    });
  } catch (err) {
    next(err);
  }
};

const getShareSubFolderView = async (req, res, next) => {
  const folderId = parseInt(req.params.folderId);
  const sharedFolderId = req.params.id;
  const sharedFolder = await getShareLink(sharedFolderId);

  const path = await getFolderPath(folderId);
  const isSubFolder = parseInt(path.split('/')[0]) === sharedFolder.folderId;

  if (!isSubFolder) return res.status(404).send('Permission deny');

  const folder = await getFolderById(folderId);

  res.render('folder', {
    title: 'Shared folder',
    folderId: folder.id,
    folders: folder.subFolders,
    files: folder.items,
    shared: true,
    sharedLink: sharedFolderId,
  });
};

export {
  getShareView,
  createShareFolder,
  getShareFolderView,
  getShareSubFolderView,
};
