import prisma from "../lib/prisma.js";

// 로그인 아이디로 사용자를 조회함
export const findUserByLoginId = async (loginId) => {
  return prisma.user.findUnique({
    where: {
      loginId,
    },
  });
};

// 닉네임으로 사용자를 조회함
export const findUserByNickname = async (nickname) => {
  return prisma.user.findUnique({
    where: {
      nickname,
    },
  });
};

// 회원가입 정보를 사용해 새로운 사용자를 생성함
export const createUser = async ({
  loginId,
  passwordHash,
  nickname,
}) => {
  return prisma.user.create({
    data: {
      loginId,
      passwordHash,
      nickname,
    },
    select: {
      id: true,
      loginId: true,
      nickname: true,
      point: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};