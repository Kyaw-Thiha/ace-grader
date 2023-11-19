import React, { useEffect, useState } from "react";
import { type RouterOutputs, api } from "@/utils/api";
import { pusherClient } from "@/lib/pusher";

import { toast } from "react-toastify";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type Profile = RouterOutputs["teacherProfile"]["getWorksheets"];
interface Props {
  profile: Profile;
}

export const Notification: React.FC<Props> = (props) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  const { data, refetch, isLoading, isError } =
    api.teacherNotification.get15Latest.useQuery({
      profileId: props.profile?.id ?? "",
    });

  useEffect(() => {
    if (props.profile?.id) {
      pusherClient.subscribe(`teacher-${props.profile?.id}`);

      pusherClient.bind("notification", (text: string) => {
        setNotifications((prev) => [...prev, text]);

        console.log("changed");
        toast.info(text, { autoClose: false });
        console.log("noti");

        void refetch();
      });
    }

    return () => {
      pusherClient.unsubscribe(`teacher-${props.profile?.id ?? ""}`);
    };
  }, [props.profile?.id]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Bell className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea className="h-[200px] w-[200px] rounded-md border p-4 md:h-[400px] md:w-[350px]">
          <div className="mb-4 space-y-2">
            <h4 className="text-xl font-medium leading-none">Notifications</h4>
          </div>
          <div className="flex flex-col gap-4">
            {data?.map((notification) => {
              return (
                <div key={notification.id} className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {notification.time?.toLocaleTimeString()}
                    </p>
                    <p className="text-sm">{notification.text}</p>
                  </div>

                  <Separator />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
