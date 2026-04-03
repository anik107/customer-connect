"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

export function Reanalyze() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline ml-2">Reanalyze</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reanalyze Data</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Prime Bank Posts</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Prime Bank posts..."
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Other Banks Posts</Label>
              <Input
                id="username-1"
                name="username"
                placeholder="Other Banks Posts..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Reanalyze</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
