"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { P } from "@/src/components/ui/p";
import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <AlertCircle className="text-destructive h-12 w-12" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center">
          <P>We are having trouble loading this page.</P>
          <P>You can try again or contact support if the problem persists.</P>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
