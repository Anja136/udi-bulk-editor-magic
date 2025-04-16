
import { useState, useMemo } from 'react';
import { UDIRecord } from '@/types/udi';
import FileUploader from '@/components/FileUploader';
import UDIDataTable from '@/components/UDIDataTable';
import TableControls from '@/components/TableControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload, Table, ArrowLeft, ArrowRight, Database } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateMockData } from '@/lib/mockData';
import { FilterOption, filterRecords } from '@/lib/filterUtils';

const Index = () => {
  const [data, setData] = useState<UDIRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const { toast } = useToast();

  const handleDataLoaded = (newData: UDIRecord[]) => {
    setData(newData);
    setActiveTab('table');
    
    toast({
      title: "Data loaded successfully",
      description: `${newData.length} records are ready for editing.`,
    });
  };

  const handleDataChange = (updatedData: UDIRecord[]) => {
    setData(updatedData);
  };

  const handleClearData = () => {
    setData([]);
    setActiveTab('upload');
    setFilters([]);
  };

  const loadTestData = (count: number, withIssues: boolean = true) => {
    const testData = generateMockData(count);
    
    // If requested, make some records editable for easier testing
    if (!withIssues) {
      const unlockRecords = testData.map((record, index) => ({
        ...record,
        isLocked: index % 3 !== 0, // Make every third record unlocked for easy editing tests
        status: 'valid' as const,
        errors: undefined,
        warnings: undefined
      }));
      setData(unlockRecords);
    } else {
      setData(testData);
    }
    
    setActiveTab('table');
    
    toast({
      title: "Test data loaded",
      description: `${count} test records are ready for editing.`,
    });
  };

  const handleFilterChange = (newFilters: FilterOption[]) => {
    setFilters(newFilters);
  };

  const filteredData = useMemo(() => {
    return filterRecords(data, filters);
  }, [data, filters]);

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UDI Bulk Editor</h1>
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
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadTestData(5, false)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Load 5 Clean Records
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadTestData(15, true)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Load 15 Mixed Records
            </Button>
          </div>
        </div>
        
        <TabsContent value="upload" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Upload UDI Data</CardTitle>
              <CardDescription>
                Upload your UDI data file in CSV or Excel format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onDataLoaded={handleDataLoaded} />
            </CardContent>
          </Card>
          
          {data.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={() => setActiveTab('table')}
                className="flex items-center gap-2"
              >
                Go to Data Editor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>UDI Data Editor</CardTitle>
              <CardDescription>
                Edit, validate, and manage your UDI data before import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TableControls 
                data={filteredData}
                onDataChange={handleDataChange}
                onClearData={handleClearData}
                onFilterChange={handleFilterChange}
                activeFilters={filters}
              />
              
              <Separator />
              
              <UDIDataTable
                data={filteredData}
                onDataChange={handleDataChange}
              />
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
