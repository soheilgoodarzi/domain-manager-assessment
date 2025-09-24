"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDomain, updateDomain, CreateDomainInput } from "@/services/api"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect } from "react"
import toast from "react-hot-toast"
import { Domain } from "@/types/domain"

const domainFormSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
  status: z.enum(["1", "2", "3"]),
  isActive: z.enum(["true", "false"]),
})

type DomainFormValues = z.infer<typeof domainFormSchema>

interface DomainModalProps {
  isOpen: boolean
  onClose: () => void
  domainToEdit?: Domain | null 
}

const DomainModal = ({ isOpen, onClose, domainToEdit }: DomainModalProps) => {
  const isEditMode = !!domainToEdit

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
  })

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && domainToEdit) {
        reset({
          domain: domainToEdit.domain,
          status: String(domainToEdit.status) as "1" | "2" | "3",
          isActive: String(domainToEdit.isActive) as "true" | "false",
        })
      } else {
        reset({
          domain: "",
          status: "1",
          isActive: "true",
        })
      }
    }
  }, [isOpen, isEditMode, domainToEdit, reset])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createDomain,
    onSuccess: () => {
      toast.success("Domain created successfully!")
      queryClient.invalidateQueries({ queryKey: ["domains"] })
      onClose()
    },
    onError: (error: Error) => {
      toast.error(`Failed to create domain: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateDomain,
    onSuccess: () => {
      toast.success("Domain updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["domains"] })
      onClose()
    },
    onError: (error: Error) => {
      toast.error(`Failed to update domain: ${error.message}`)
    },
  })

  const onSubmit = (formData: DomainFormValues) => {
    const dataToSend: CreateDomainInput = {
      domain: formData.domain,
      status: Number(formData.status) as 1 | 2 | 3,
      isActive: formData.isActive === "true",
    }

    if (isEditMode && domainToEdit) {
      updateMutation.mutate({ id: domainToEdit.id, data: dataToSend })
    } else {
      createMutation.mutate(dataToSend)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  {isEditMode ? "Edit Domain" : "Add Domain"}
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="domain"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Domain
                    </label>
                    <input
                      {...register("domain")}
                      id="domain"
                      type="text"
                      placeholder="www.example.com"
                      className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    {errors.domain && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.domain.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Status
                    </label>
                    <select
                      {...register("status")}
                      id="status"
                      className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="1">Pending</option>
                      <option value="2">Verified</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="isActive"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Active
                    </label>
                    <select
                      {...register("isActive")}
                      id="isActive"
                      className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-slate-500"
                    >
                      {isPending
                        ? isEditMode
                          ? "Saving..."
                          : "Creating..."
                        : isEditMode
                        ? "Save Changes"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default DomainModal
