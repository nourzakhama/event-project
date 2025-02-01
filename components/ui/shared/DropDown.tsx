"use client";
import React, { startTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
};

const DropDown = ({ value, onChangeHandler }: Props) => {
  const [categories, setCategories] = useState([
    { id: "1", name: "attente" },
    { id: "2", name: "cour" },
    { id: "3", name: "saturé" },
    { id: "4", name: "terminé" },
    { id: "5", name: "annulé" },
    { id: "6", name: "délai" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  // Handle adding a new status
  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      if (!categories.some((category) => category.name === newCategory)) {
        const newId = (categories.length + 1).toString();
        setCategories((prev) => [...prev, { id: newId, name: newCategory }]);
        setNewCategory("");
      } else {
        alert("This status already exists!");
      }
    }
  };

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="w-full select-field !text-black">
        <SelectValue placeholder="status" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.name}
              className="select-item p-regular-14 !text-black"
            >
              {category.name}
            </SelectItem>
          ))}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add new status
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>New Status</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Status name"
                  value={newCategory}
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  startTransition(() => {
                    handleAddCategory();
                  })
                }
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default DropDown;
