"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createExam, updateExam } from "@/lib/actions";
import { ExamSchema, examSchema } from "@/lib/formValidationSchemas";

export default function ExamForm(
  { type, setOpen, data, relatedData }: 
  { type: "create" | "update"; setOpen: Dispatch<SetStateAction<boolean>>; data?: any; relatedData: any }
) {
  const { register, handleSubmit, formState: { errors } } = useForm<ExamSchema>({ resolver: zodResolver(examSchema) });

  const [state, formAction] = useFormState(type === "create" ? createExam : updateExam, {success: false, error: false})

  const onSubmit = handleSubmit(data => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  const { lessons } = relatedData;

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === 'create' ? "created" : "updated" }`)
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen])

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new exam" : "Update the exam"}</h1>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime.toISOString()}
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime.toISOString()}
          register={register}
          error={errors.endTime}
        />
        {data && (
          <InputField
            label="Exam Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}
            hidden
          />
        )}
         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: {id: number; name:string }) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        { type === "create" ? "Create" : "Update" }
      </button>
    </form>
  )
}