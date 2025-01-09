"use server"

import { revalidatePath } from "next/cache";
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
  success: boolean;
  error: boolean;
}

export async function createSubject(currentState: CurrentState, data: SubjectSchema) {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map(teacherId => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function updateSubject(currentState: CurrentState, data: SubjectSchema) {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map(teacherId => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function deleteSubject(currentState: CurrentState, data: FormData) {

  const id = data.get("id") as string;

  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function createClass(currentState: CurrentState, data: ClassSchema) {
  try {
    await prisma.class.create({
      data,
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function updateClass(currentState: CurrentState, data: ClassSchema) {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function deleteClass(currentState: CurrentState, data: FormData) {

  const id = data.get("id") as string;

  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function createTeacher(currentState: CurrentState, data: TeacherSchema) {
  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          }))
        },
      }
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function updateTeacher(currentState: CurrentState, data: TeacherSchema) {

  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && {password: data.password}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && {password: data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          }))
        },
      }
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function deleteTeacher(currentState: CurrentState, data: FormData) {

  const id = data.get("id") as string;

  try {
    const client = await clerkClient();

    await client.users.deleteUser(id);
    
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function createStudent(currentState: CurrentState, data: StudentSchema) {

  try {
    const classItem = await prisma.class.findUnique({
      where: {id: data.classId },
      include: {
        _count: { select: { students: true } }
      }
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,      
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      }
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function updateStudent(currentState: CurrentState, data: StudentSchema) {

  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && {password: data.password}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && {password: data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        gender: data.gender,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      }
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function deleteStudent(currentState: CurrentState, data: FormData) {

  const id = data.get("id") as string;

  try {
    const client = await clerkClient();

    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function createExam(currentState: CurrentState, data: ExamSchema) {
  const { userId, sessionClaims } = await auth();          
  const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
  const currentUserId = userId;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: data.lessonId,
        }
      });
  
      if (!teacherLesson) {
        return { success: false, error: true };
      };
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime:data.endTime,
        lessonId: data.lessonId,
      },
    });
  
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function updateExam(currentState: CurrentState, data: ExamSchema) {
  const { userId, sessionClaims } = await auth();          
  const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
  const currentUserId = userId;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: data.lessonId,
        }
      });
  
      if (!teacherLesson) {
        return { success: false, error: true };
      };
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime:data.endTime,
        lessonId: data.lessonId,
      },
    });
  
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export async function deleteExam(currentState: CurrentState, data: FormData) {

  const id = data.get("id") as string;

  const { userId, sessionClaims } = await auth();          
  const role = (sessionClaims?.metadata as { role?: "admin" | "teacher" | "student" | "parent" })?.role;
  const currentUserId = userId;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ?  { lesson: { teacherId: currentUserId! } } : {})
      },
    });

    return { success: true, error: false };    
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};