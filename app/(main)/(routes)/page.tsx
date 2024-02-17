import { ModeToggle } from "@/components/mode-toogle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
      <Sheet>
        <div>
          <UserButton 
          afterSignOutUrl="/sign-up"
          />
          <ModeToggle />
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </div>
        </Sheet>
    );
}
