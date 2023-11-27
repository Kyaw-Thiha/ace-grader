import { CheckCircle, Loader2, ShieldAlert, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  connectionStatus: "offline" | "loading" | "success" | "error";
}

export const ConnectionStatus: React.FC<Props> = (props) => {
  if (props.connectionStatus == "offline") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-block rounded-full border-2 p-1 text-yellow-500">
              <ShieldAlert className="h-8 w-8 transition-all" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>You lost internet connection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (props.connectionStatus == "success") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-block rounded-full border-2  p-1 text-green-500">
              <CheckCircle className="h-8 w-8 transition-all" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Synced with server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (props.connectionStatus == "loading") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-block rounded-full border-2 p-1 text-green-500">
              <div className="animate-spin">
                <Loader2 className="h-6 w-6" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Loading...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else if (props.connectionStatus == "error") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-block rounded-full border-2 p-1 text-red-500">
              <XCircle className="h-8 w-8 transition-all" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Error with Server!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};
