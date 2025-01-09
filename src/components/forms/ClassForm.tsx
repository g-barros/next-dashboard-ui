"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClass, updateClass } from "@/lib/actions";

export default function ClassForm(
  { type, setOpen, data, relatedData }: 
  { type: "create" | "update"; setOpen: Dispatch<SetStateAction<boolean>>; data?: any; relatedData: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ClassSchema>({ resolver: zodResolver(classSchema) });

  const [state, formAction] = useFormState(type === "create" ? createClass : updateClass, {success: false, error: false})

  const onSubmit = handleSubmit(data => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  const { teachers, grades } = relatedData;

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === 'create' ? "created" : "updated" }`)
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen])

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : "Update the class"}</h1>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors.capacity}
        />
        {data && (
          <InputField
            label="Subject Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}
            hidden
          />
        )}
         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.teachers}
          >
            {teachers.map((teacher: {id: string; name:string; surname:string; }) => (
              <option key={teacher.id} value={teacher.id} selected={data && teacher.id === data.supervisorId}>
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: {id: number; level: number; }) => (
              <option key={grade.id} value={grade.id} selected={data && grade.id === data.gradeId}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
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