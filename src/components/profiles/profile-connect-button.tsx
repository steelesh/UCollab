"use client";

import { UserPlus, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ActionButton } from "~/components/ui/action-button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { connectUser, disconnectUser } from "~/features/users/user.actions";
import { toastError, toastSuccess } from "~/lib/toast";

type ProfileConnectButtonProps = {
  readonly targetUsername: string;
  readonly initialConnected: boolean;
  readonly className?: string;
};

export function ProfileConnectButton({
  targetUsername,
  initialConnected,
  className = "",
}: ProfileConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(initialConnected);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectUser(targetUsername);
      setIsConnected(true);
      router.refresh();
      toastSuccess("Connected", {
        description: `You are now connected with ${targetUsername}`,
      });
    } catch {
      toastError("Connection Failed", {
        description: "Unable to connect with the user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConfirmDialogOpen(true);
  };

  const performDisconnect = async () => {
    setIsLoading(true);
    setConfirmDialogOpen(false);
    try {
      await disconnectUser(targetUsername);
      setIsConnected(false);
      router.refresh();
      toastSuccess("Disconnected", {
        description: `You have disconnected from ${targetUsername}`,
      });
    } catch {
      toastError("Disconnection Failed", {
        description: "Unable to disconnect. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {isConnected
        ? (
            <ActionButton
              variant="ghost"
              icon={<UserRoundX className="h-5 w-5 text-uc-red" />}
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              Disconnect
            </ActionButton>
          )
        : (
            <ActionButton
              variant="ghost"
              icon={<UserPlus className="h-5 w-5 text-green-600" />}
              onClick={handleConnect}
              disabled={isLoading}
            >
              Connect
            </ActionButton>
          )}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChangeAction={setConfirmDialogOpen}
        title="Disconnect with User"
        description={`Are you sure you want to disconnect from ${targetUsername}?`}
        confirmText="Disconnect"
        cancelText="Cancel"
        onConfirmAction={performDisconnect}
      />
    </div>
  );
}
