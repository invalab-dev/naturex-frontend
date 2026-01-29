'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

interface GenerateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportModal({
  open,
  onOpenChange,
}: GenerateReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'executive-summary',
    'site-analysis',
    'biodiversity',
    'legal-compliance',
  ]);

  const reportSections = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'site-analysis', label: 'Site Analysis & Mapping' },
    { id: 'biodiversity', label: 'Biodiversity Assessment' },
    { id: 'habitat', label: 'Habitat Classification' },
    { id: 'corridor', label: 'Ecological Corridor Analysis' },
    { id: 'legal-compliance', label: 'Legal Compliance Report' },
    { id: 'mitigation', label: 'Mitigation Measures' },
    { id: 'monitoring', label: 'Monitoring Plan' },
  ];

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsComplete(false);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate EIA Report
          </DialogTitle>
          <DialogDescription>
            Select the sections to include in your environmental impact
            assessment report
          </DialogDescription>
        </DialogHeader>

        {!isComplete ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {reportSections.map((section) => (
                  <div key={section.id} className="flex items-center gap-2">
                    <Checkbox
                      id={section.id}
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={() => toggleSection(section.id)}
                      disabled={isGenerating}
                    />
                    <Label
                      htmlFor={section.id}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {section.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {selectedSections.length} sections selected
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || selectedSections.length === 0}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-1">
                  Report Generated Successfully
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your EIA report is ready to download
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
