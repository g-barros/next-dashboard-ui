import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";

export default async function Announcements() {

  const {userId, sessionClaims} = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  }

  const announcementData = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Announcements</h1>
        <span className="text-sm text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {announcementData[0] && 
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcementData[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">{announcementData[0].date.toLocaleTimeString("pt-BR", {
                hour:"2-digit",
                minute:"2-digit",
                hour12: false,
                })}</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">{announcementData[0].description}</p>
          </div>
        }
        {announcementData[1] &&
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcementData[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">{announcementData[1].date.toLocaleTimeString("pt-BR", {
                hour:"2-digit",
                minute:"2-digit",
                hour12: false,
                })}</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">{announcementData[1].description}</p>
          </div>
        }
        {announcementData[2] && 
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcementData[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">{announcementData[2].date.toLocaleTimeString("pt-BR", {
                hour:"2-digit",
                minute:"2-digit",
                hour12: false,
                })}</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">{announcementData[2].description}</p>
          </div>
        }
      </div>
    </div>
  )
}