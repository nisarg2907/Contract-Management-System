import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropDownMenu";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Action {
  name: string;
  onClick: () => Promise<void> | void;
  requiresConfirmation?: boolean;
}

interface DropdownActionsMenuProps {
  actions: Action[];
}

const DropdownActionsMenu: React.FC<DropdownActionsMenuProps> = ({
  actions,
}) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ action: Action, index: number } | null>(null);

  const handleActionClick = async (e: React.MouseEvent, action: Action, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (action.requiresConfirmation) {
      setSelectedAction({ action, index });
      setIsDialogOpen(true);
    } else {
      setLoadingIndex(index);
      try {
        await action.onClick();
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const confirmAction = async () => {
    if (selectedAction) {
      setLoadingIndex(selectedAction.index); 
      try {
        await selectedAction.action.onClick(); 
      } finally {
        setLoadingIndex(null); 
        setIsDialogOpen(false);
        setSelectedAction(null);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.length === 0 ? (
            <DropdownMenuItem disabled>No actions to show</DropdownMenuItem>
          ) : (
            actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={(e) => handleActionClick(e, action, index)}
              >
                {loadingIndex === index ? <Loader2 className="animate-spin h-4 w-4" /> : action.name}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to do this?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmAction}>
              {loadingIndex !== null ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropdownActionsMenu;
