"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { getEventById } from "@/lib/actions/event";
import type { Event } from "@/types";
import { FileUploader } from "./FileUploader";
import DropDown from "./DropDown";
import { verifyEmployeAvailability } from "@/lib/actions/event";
import { changeEmployeStatus } from "@/lib/actions/event";
import { generateReactHelpers } from "@uploadthing/react";

const { useUploadThing } = generateReactHelpers();

type Props = {
  id?: string;
  userId: string;
  type: "create" | "update";
};

const EventForm = ({ userId, type, id }: Props) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );

  const handleStatusChange = (value: string) => {
    console.log("Selected status ID:", value);
    setSelectedStatus(value);
  };

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      dateD: null,
      dateF: null,
      employees: "",
      resources: "",
      participants: "",
      status: "",
      prix: "",
      capacity: "",
      imageUrl: "",
    },
  });

  // Fetch event data if type is "update"
  useEffect(() => {
    if (type === "update" && id) {
      const fetchEventData = async () => {
        try {
          const eventData = (await getEventById(id)) as unknown as Event;
          if (eventData) {
            form.setValue("title", eventData.title || "");
            form.setValue("category", eventData.category || "");
            form.setValue("description", eventData.description || "");
            form.setValue("location", eventData.location || "");
            form.setValue("dateD", eventData.dateD ? new Date(eventData.dateD) : null);
            form.setValue("dateF", eventData.dateF ? new Date(eventData.dateF) : null);
            form.setValue("employees", eventData.employees || "");
            form.setValue("resources", eventData.resources || "");
            form.setValue("participants", eventData.participants || "");
            form.setValue("prix", ""+eventData.prix || "");
            form.setValue("capacity", eventData.capacity || "");
            form.setValue("imageUrl", eventData.imageUrl || "");
            form.setValue("status", eventData.status || "");
          } else {
            setFeedbackMessage("Event not found.");
            setFeedbackType("error");
          }
        } catch (error) {
          console.error("Failed to fetch event data:", error);
          setFeedbackMessage("Failed to load event data.");
          setFeedbackType("error");
        }
      };

      fetchEventData();
    }
  }, [id, type, form]);

  // Submit handler
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    try {
      setIsSubmitting(true);

      let uploadedImageUrl = values.imageUrl;

      if (files.length > 0) {
        try {
          const uploadedImages = await startUpload(files);
          if (!uploadedImages) {
            setFeedbackMessage("Failed to upload image.");
            setFeedbackType("error");
            return;
          }
          uploadedImageUrl = uploadedImages[0].url;
        } catch (error) {
          console.error("Image upload failed:", error);
          setFeedbackMessage("Failed to upload image.");
          setFeedbackType("error");
          return;
        }
      }

      const formattedValues = {
        ...values,
        status: selectedStatus,
        dateD: values.dateD ? values.dateD.toISOString() : undefined,
        dateF: values.dateF ? values.dateF.toISOString() : undefined,
        imageUrl: uploadedImageUrl,
        creatorId: userId,
      };

      //console.log("Formatted values:", formattedValues);

      const url =
        type === "create"
          ? "http://localhost:4000/event"
          : `http://localhost:4000/event/${id}`;

      const test = await verifyEmployeAvailability(formattedValues);
      if (!test) {
        setFeedbackMessage("Failed to submit the event. Please try again.");
        setFeedbackType("error");
        setIsSubmitting(false);
        alert("Employee used is not available");
        return;
      }

      if (test && formattedValues.employees && formattedValues.employees.trim() !== "") {
        await changeEmployeStatus(formattedValues);
      }

      const response =
        type === "create"
          ? await axios.post(url, formattedValues)
          : await axios.patch(url, formattedValues);

     

      if (response.status === 200 || response.status === 201) {
        setFeedbackMessage(
          type === "create"
            ? "Event created successfully!"
            : "Event updated successfully!"
        );
        setFeedbackType("success");
        form.reset();
        setSelectedStatus(undefined);
      } else {
        console.error("Unexpected response status:", response.status, response.data);
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setFeedbackMessage("Failed to submit the event. Please try again.");
      setFeedbackType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border ">
      <h1 className="text-2xl font-semibold mb-6">
        {type === "create" ? "Create Event" : "Update Event"}
      </h1>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div
          className={`p-4 mb-4 rounded-md text-center ${
            feedbackType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedbackMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <DropDown
                    value={selectedStatus}
                    onChangeHandler={handleStatusChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Event Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name="prix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Event Price" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                    <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>capacity</FormLabel>
                <FormControl>
                  <Input placeholder="number of participant" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Event Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start and End Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <div className="h-[54px] rounded-lg border bg-gray-50 px-4 py-2">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeSelect
                        placeholderText="Select Start Date"
                        className="w-full bg-transparent border-none focus:outline-none !text-black"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateF"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <div className="h-[54px] rounded-lg border bg-gray-50 px-4 py-2">
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="MM/dd/yyyy h:mm aa"
                        showTimeSelect
                        placeholderText="Select End Date"
                        className="w-full bg-transparent border-none focus:outline-none !text-black"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Employees Field */}
          <FormField
            control={form.control}
            name="employees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employees</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated employee IDs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Participants Field */}
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participants</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated participant IDs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Resources Field */}
          <FormField
            control={form.control}
            name="resources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resources</FormLabel>
                <FormControl>
                  <Input placeholder="Comma-separated resource IDs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Submitting..."
              : `${type === "create" ? "Create" : "Update"} Event`}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;