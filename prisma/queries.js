import prisma from './prisma.js'

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
  })
};

const createUser = async ( firstName, lastName, email, password) => {
  return await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      username: email,
      password
    }
  })
}

export {
  getUserByUsername,
  getUserById,
  createUser,
}
