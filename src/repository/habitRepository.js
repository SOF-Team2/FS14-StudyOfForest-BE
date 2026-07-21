import prisma from "../lib/prisma.js";

export const getCheckedDatesByUserId = async (userId) => {
  const records = await prisma.habitRecord.findMany({
    where: { userId },
    select: { recordDate: true, isChecked: true },
  });

  const statsByDate = {};

  records.forEach((r) => {
    const dateKey = new Date(r.recordDate).toISOString().split("T")[0];
    if (!statsByDate[dateKey]) {
      statsByDate[dateKey] = { total: 0, checked: 0 };
    }
    statsByDate[dateKey].total += 1;
    if (r.isChecked) statsByDate[dateKey].checked += 1;
  });

  return statsByDate;
};
