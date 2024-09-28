"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBidSchema } from "@/lib/validations"; // Import Zod schema
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";

const CreateBidForm = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CreateBidSchema>>({
    resolver: zodResolver(CreateBidSchema),
    defaultValues: {
      title: "",
      startTime: new Date().toISOString().slice(0, -8), // Default to current date/time
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, -8), // Default to 1 hour later
      items: [{ description: "" }],
    },
  });

  // Function to add a new item to the items array
  const addItem = () => {
    const items = form.getValues("items");
    form.setValue("items", [...items, { description: "" }]);
  };

  // Function to remove an item from the items array
  const removeItem = (index: number) => {
    const items = form.getValues("items");
    const updatedItems = items.filter((_, i) => i !== index); // Remove the item at the given index
    form.setValue("items", updatedItems);
  };

  const onSubmit = async (values: z.infer<typeof CreateBidSchema>) => {
    console.log(values, new Date(values.startTime));
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bid/create`, values);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An unknown error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="w-full">
      <h2>Create a Bid</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Bid title" {...field} />
                </FormControl>
                <FormDescription>Title of the bid</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Time Field */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter start time"
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the starting bid time</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time Field */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter end time"
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the ending bid time</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Items */}
          {form.watch("items").map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Item {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Item ${index + 1} description`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeItem(index)}>
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={addItem}>
            Add Item
          </Button>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBidForm;
