import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../../lib/utils";

export function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Image
        className="aspect-square h-full w-full"
        {...props}
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        U
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}