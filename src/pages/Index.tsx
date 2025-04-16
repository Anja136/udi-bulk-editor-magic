
import { useState } from 'react';
import { UDIRecord } from '@/types/udi';
import FileUploader from '@/components/FileUploader';
import UDIDataTable from '@/components/UDIDataTable';
import TableControls from '@/components/TableControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [data, setData] = useState<UDIRecord[]>([]);
  const [activeTab, setActiveTab] = useState<string>('table');

  const handleDataLoaded = (newData: UDIRecord[]) => {
    setData(newData);
    setActiveTab('table');
  };

  const handleDataChange = (updatedData: UDIRecord[]) => {
    setData(updatedData);
  };

  const handleClearData = () => {
    setData([]);
    setActiveTab('upload');
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UDI Bulk Editor</h1>
        <p className="text-muted-foreground mt-1">
          Upload, validate, and edit UDI device data in bulk
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="table" disabled={data.length === 0}>Data Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>UDI Data Editor</CardTitle>
              <CardDescription>
                Edit, validate, and manage your UDI data before import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TableControls 
                data={data}
                onDataChange={handleDataChange}
                onClearData={handleClearData}
              />
              
              <Separator />
              
              <UDIDataTable
                data={data}
                onDataChange={handleDataChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
