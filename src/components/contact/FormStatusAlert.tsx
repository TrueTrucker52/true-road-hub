import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormStatusAlertProps = {
  message: string;
  variant: "error" | "success";
};

const FormStatusAlert = ({ message, variant }: FormStatusAlertProps) => {
  if (variant === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-brand-red/20 bg-background/90 text-foreground">
      <CheckCircle2 className="h-4 w-4 text-brand-red" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default FormStatusAlert;