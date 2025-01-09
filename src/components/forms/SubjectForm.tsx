"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SubjectForm (
  { type, setOpen, data, relatedData }: 
  { type: "create" | "update"; setOpen: Dispatch<SetStateAction<boolean>>; data?: any; relatedData: any }
) {
  const { register, handleSubmit, formState: { errors } } = useForm<SubjectSchema>({ resolver: zodResolver(subjectSchema) });

  const [state, formAction] = useFormState(type === "create" ? createSubject : updateSubject, {success: false, error: false})

  const onSubmit = handleSubmit(data => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  const { teachers } = relatedData;

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === 'create' ? "created" : "updated" }`)
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen])

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new subject" : "Update the subject"}</h1>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
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
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map((teacher: {id: string; name:string; surname:string; }) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
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