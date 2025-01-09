"use client"

import { deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./forms/StudentForm"), { loading: () => <h1>Loading...</h1> });
const ParentForm = dynamic(() => import("./forms/ParentForm"), { loading: () => <h1>Loading...</h1> });
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), { loading: () => <h1>Loading...</h1> });
const ResultForm = dynamic(() => import("./forms/ResultForm"), { loading: () => <h1>Loading...</h1> });
const LessonForm = dynamic(() => import("./forms/LessonForm"), { loading: () => <h1>Loading...</h1> });
const ExamForm = dynamic(() => import("./forms/ExamForm"), { loading: () => <h1>Loading...</h1> });
const EventForm = dynamic(() => import("./forms/EventForm"), { loading: () => <h1>Loading...</h1> });
const ClassForm = dynamic(() => import("./forms/ClassForm"), { loading: () => <h1>Loading...</h1> });
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), { loading: () => <h1>Loading...</h1> });
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), { loading: () => <h1>Loading...</h1> });

const forms: {
  [key: string]: (type: "create" | "update", setOpen: Dispatch<SetStateAction<boolean>>, data?: any, relatedData?: any) => JSX.Element;

} = {
  teacher: (type, data, setOpen, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  student: (type, data, setOpen, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  // parent: (type, data, setOpen) => <ParentForm type={type} data={data} setOpen={setOpen} />,
  subject: (type, data, setOpen, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  class: (type, data, setOpen, relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
//   lesson: (type, data, setOpen) => <LessonForm type={type} data={data} setOpen={setOpen} />,
  exam: (type, data, setOpen, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
//   assignment: (type, data, setOpen) => <AssignmentForm type={type} data={data} setOpen={setOpen} />,
//   result: (type, data, setOpen) => <ResultForm type={type} data={data} setOpen={setOpen} />,
//   event: (type, data, setOpen) => <EventForm type={type} data={data} setOpen={setOpen} />,
//   announcement: (type, data, setOpen) => <AnnouncementForm type={type} data={data} setOpen={setOpen} />,
};

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

export default function FormModal({table, type, data, id, relatedData}: FormContainerProps & {relatedData?: any}) {

  const size = type === "create" ? "w-8 h-8": "w-7 h-7";
  const bgColor = type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";

  const [open, setOpen]= useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted`)
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}?</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, setOpen, relatedData)
    ) : "Form not found";
  }

  return (
    <>
      <button 
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`} 
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}