"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDomain, CreateDomainInput } from "@/services/api";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import toast from "react-hot-toast";

const domainFormSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "Invalid domain format"
    ),
  status: z.enum(["1", "2", "3"]),
  isActive: z.enum(["true", "false"]),
});

type DomainFormValues = z.infer<typeof domainFormSchema>;

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DomainModal = ({ isOpen, onClose }: DomainModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainFormValues>({ 
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domain: "",
      status: "1",     
      isActive: "true", 
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createDomain,
    onSuccess: () => {
      toast.success("Domain created successfully!");
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create domain: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (formData: DomainFormValues) => {
    const dataToSend: CreateDomainInput = {
      domain: formData.domain,
      status: Number(formData.status) as 1 | 2 | 3, 
      isActive: formData.isActive === "true", 
    };
    
    mutate(dataToSend);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">Add Domain</Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-slate-300">Domain</label>
                    <input {...register("domain")} id="domain" type="text" placeholder="www.example.com" className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {errors.domain && <p className="mt-1 text-sm text-red-400">{errors.domain.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300">Status</label>
                    <select {...register("status")} id="status" className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option value="1">Pending</option>
                      <option value="2">Verified</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="isActive" className="block text-sm font-medium text-slate-300">Active</label>
                    <select {...register("isActive")} id="isActive" className="mt-1 w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-slate-500">{isPending ? "Creating..." : "Create"}</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DomainModal;

