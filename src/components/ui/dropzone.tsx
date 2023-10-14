import Dropzone from "react-dropzone";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useFileContext } from "@/lib/FileContext";
import React from "react";
const dropzoneVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        dashed: `border-dashed border-primary border-2 
          hover:bg-accent hover:border-accent-foreground`,
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "xlUi",
        long: "h-20 w-full",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "dashed",
      size: "xl",
    },
  },
);

export interface DropzoneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropzoneVariants> {
  asChild?: boolean;
}

export default function DropzoneComponent({
  className,
  variant,
  size,
}: DropzoneProps) {
  const { addSelectedFiles } = useFileContext();

  const handleDrop = (acceptedFiles: File[]) => {
    addSelectedFiles(acceptedFiles);
  };

  return (
    <Dropzone onDrop={handleDrop} maxFiles={1} multiple={false}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({ className: "dropzone" })}
          className={cn(dropzoneVariants({ variant, size, className }))}
        >
          <input {...getInputProps()} />
          Upload Video
        </div>
      )}
    </Dropzone>
  );
}
