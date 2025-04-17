import { useState, useMemo } from 'react';
import { UDIRecord } from '@/types/udi';
import FileUploader from '@/components/FileUploader'; // Updated import path
import { UploadHistory } from '@/components/FileUploader/types'; // Updated import path
import UDIDataTable from '@/components/UDIDataTable';
import TableControls from '@/components/TableControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload, Table, ArrowLeft, ArrowRight, Database, FileText, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateMockData } from '@/lib/mockData';
import { FilterOption, filterRecords } from '@/lib/filterUtils';
const Index = () => {
  const [data, setData] = useState<UDIRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [viewMode, setViewMode] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<UploadHistory | null>(null);
  const {
    toast
  } = useToast();
  const handleDataLoaded = (newData: UDIRecord[]) => {
    setData(newData);
    setActiveTab('table');
    setViewMode(false);
    setSelectedHistory(null);
    toast({
      title: "Data loaded successfully",
      description: `${newData.length} records are ready for editing.`
    });
  };
  const handleHistorySelect = (history: UploadHistory) => {
    setData(history.data);
    setActiveTab('table');
    setViewMode(true);
    setSelectedHistory(history);
    toast({
      title: "Historical data loaded",
      description: `Viewing ${history.fileName} in read-only mode.`
    });
  };
  const handleDataChange = (updatedData: UDIRecord[]) => {
    if (viewMode) return; // Prevent edits in view mode
    setData(updatedData);
  };
  const handleClearData = () => {
    setData([]);
    setActiveTab('upload');
    setFilters([]);
    setViewMode(false);
    setSelectedHistory(null);
  };
  const loadTestData = (count: number, withIssues: boolean = true) => {
    const testData = generateMockData(count);

    // If requested, make some records editable for easier testing
    if (!withIssues) {
      const unlockRecords = testData.map((record, index) => ({
        ...record,
        isLocked: index % 3 !== 0,
        // Make every third record unlocked for easy editing tests
        status: 'valid' as const,
        errors: undefined,
        warnings: undefined
      }));
      setData(unlockRecords);
    } else {
      setData(testData);
    }
    setActiveTab('table');
    setViewMode(false);
    setSelectedHistory(null);
    toast({
      title: "Test data loaded",
      description: `${count} test records are ready for editing.`
    });
  };
  const handleFilterChange = (newFilters: FilterOption[]) => {
    setFilters(newFilters);
  };
  const filteredData = useMemo(() => {
    return filterRecords(data, filters);
  }, [data, filters]);
  const exitViewMode = () => {
    setViewMode(false);
    setSelectedHistory(null);
  };
  return <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UDI Bulk Editor - Upload, Review & Edit</h1>
        <p className="text-muted-foreground mt-1">
          Upload, validate, and edit UDI device data in bulk
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-64 grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="table" disabled={data.length === 0} className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Data Editor
              {viewMode && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadTestData(5, false)} className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Load 5 Clean Records
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadTestData(15, true)} className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Load 15 Mixed Records
            </Button>
          </div>
        </div>
        
        <TabsContent value="upload" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Drop the File</CardTitle>
              <CardDescription>
                Upload your UDI data file in CSV or Excel format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onDataLoaded={handleDataLoaded} onHistorySelect={handleHistorySelect} />
            </CardContent>
          </Card>
          
          {data.length > 0 && <div className="mt-4 flex justify-end">
              <Button onClick={() => setActiveTab('table')} className="flex items-center gap-2">
                Go to Data Editor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {viewMode ? <div className="flex items-center">
                        <span>UDI Data Viewer</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">Read Only</span>
                      </div> : "UDI Data Editor"}
                  </CardTitle>
                  <CardDescription>
                    {viewMode ? `Viewing historical data: ${selectedHistory?.fileName}` : "Edit, validate, and manage your UDI data before import"}
                  </CardDescription>
                </div>
                
                {viewMode && <Button variant="outline" size="sm" onClick={exitViewMode} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Edit New Data
                  </Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <TableControls data={filteredData} onDataChange={handleDataChange} onClearData={handleClearData} onFilterChange={handleFilterChange} activeFilters={filters} viewMode={viewMode} />
              
              <Separator />
              
              <UDIDataTable data={filteredData} onDataChange={handleDataChange} onFilterChange={handleFilterChange} activeFilters={filters} viewMode={viewMode} />
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('upload')} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Index;