"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Check } from "lucide-react";

interface UploadForestDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadForestDataModal({
  open,
  onOpenChange,
}: UploadForestDataModalProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    setTimeout(() => {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Forest Data</DialogTitle>
          <DialogDescription>
            Upload LiDAR scans, drone imagery, or forest inventory data
          </DialogDescription>
        </DialogHeader>

        {!uploadSuccess ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload
                size={32}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <div className="text-sm font-medium mb-1">LiDAR Data Files</div>
              <div className="text-xs text-muted-foreground mb-3">
                Drag and drop or click to browse
              </div>
              <input
                type="file"
                className="hidden"
                accept=".las,.laz,.xyz"
                multiple
              />
              <Button variant="secondary" size="sm">
                Choose Files
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                Supported: .las, .laz, .xyz
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <FileText
                size={32}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <div className="text-sm font-medium mb-1">Drone Imagery</div>
              <div className="text-xs text-muted-foreground mb-3">
                Orthomosaic or individual images
              </div>
              <input
                type="file"
                className="hidden"
                accept=".tif,.tiff,.jpg,.jpeg,.png"
                multiple
              />
              <Button variant="secondary" size="sm">
                Choose Files
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                Supported: .tif, .tiff, .jpg, .png
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <FileText
                size={32}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <div className="text-sm font-medium mb-1">
                Forest Inventory CSV
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Species data, measurements, locations
              </div>
              <input type="file" className="hidden" accept=".csv,.xlsx" />
              <Button variant="secondary" size="sm">
                Choose File
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                Supported: .csv, .xlsx
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} className="flex-1">
                Upload & Process
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <div className="text-lg font-semibold mb-2">Upload Successful!</div>
            <div className="text-sm text-muted-foreground">
              Your forest data is being processed...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
