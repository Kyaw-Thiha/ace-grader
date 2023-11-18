import React, { useEffect, useState } from "react";
import { type RouterOutputs, api } from "@/utils/api";
import { pusherClient } from "@/lib/pusher";

import { toast } from "react-toastify";

type Profile = RouterOutputs["teacherProfile"]["getWorksheets"];
interface Props {
  profile: Profile;
}

export const Notification: React.FC<Props> = (props) => {
  const [incomingMessages, setIncomingMessages] = useState<string[]>([]);

  const { data, refetch, isLoading, isError } =
    api.teacherNotification.get15Latest.useQuery({
      profileId: props.profile?.id ?? "",
    });

  useEffect(() => {
    if (props.profile?.id) {
      pusherClient.subscribe(`teacher-${props.profile?.id}`);

      pusherClient.bind("notification", (text: string) => {
        setIncomingMessages((prev) => [...prev, text]);

        toast.info(text, { autoClose: 7000 });
      });
    }

    return () => {
      pusherClient.unsubscribe(`teacher-${props.profile?.id ?? ""}`);
    };
  }, [props.profile?.id]);

  return <>{data?.length}</>;
};
