'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, File, CheckCircle2 } from 'lucide-react';

interface UploadDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDataModal({ open, onOpenChange }: UploadDataModalProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = () => {
    setIsUploaded(true);
    setTimeout(() => {
      setIsUploaded(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Tree Data</DialogTitle>
          <DialogDescription>
            Upload drone images, LiDAR files, or multispectral data for analysis
          </DialogDescription>
        </DialogHeader>

        {!isUploaded ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleUpload();
              }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: .jpg, .png, .tif, .las, .laz
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Supported file types:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <File size={14} className="text-muted-foreground" />
                  <span>Drone Images (.jpg, .png)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <File size={14} className="text-muted-foreground" />
                  <span>LiDAR (.las, .laz)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <File size={14} className="text-muted-foreground" />
                  <span>Multispectral (.tif)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <File size={14} className="text-muted-foreground" />
                  <span>CSV Data (.csv)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleUpload}>
                <Upload size={16} className="mr-2" />
                Select Files
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-1">Upload Successful!</h3>
            <p className="text-sm text-muted-foreground">
              New tree data has been uploaded and is being processed
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
