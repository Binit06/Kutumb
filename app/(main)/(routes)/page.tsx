import { ModeToggle } from "@/components/mode-toogle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
      <Sheet>
        <div>
          <UserButton 
          afterSignOutUrl="/"
          />
          <ModeToggle />
          <SheetTrigger>
            <div className="padding-3 border-2 border-neutral-500 rounded-lg">
            Compete Profile
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely Sure?</SheetTitle>
              <SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </div>
      </Sheet>
    );
}
