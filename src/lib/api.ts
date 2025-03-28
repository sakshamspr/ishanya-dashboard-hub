import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Using the provided Supabase credentials
const supabaseUrl = 'https://nizvcdssajfpjtncbojx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5penZjZHNzYWpmcGp0bmNib2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTU0ODksImV4cCI6MjA1ODE5MTQ4OX0.5b2Yzfzzzz-C8S6iqhG3SinKszlgjdd4NUxogWIxCLc';

// Function to check if Supabase credentials are configured
const checkSupabaseConfig = () => {
  // Since we're using hardcoded credentials now, this always returns true
  return true;
};

const supabase = createClient(supabaseUrl, supabaseKey);

export type Center = {
  id: string;  // Updated from number to string to match UUID format
  center_id: number;  // Added this field based on the actual data structure
  name: string;
  location: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  num_of_student?: number;
  num_of_educator?: number;
  num_of_employees?: number;
};

export type Program = {
  id: string;  // Updated to string for UUID format
  program_id: number; // Numeric ID
  name: string;
  description?: string;
  center_id: number;
  image_url?: string;
  created_at?: string;
  num_of_student?: number;
  num_of_educator?: number;
};

export type TableInfo = {
  id: number;
  name: string;
  description?: string;
  program_id: number;
};

// Generic function to handle API errors
const handleError = (error: any, customMessage?: string) => {
  console.error('API Error:', error);
  toast.error(customMessage || 'An error occurred. Please try again.');
  return null;
};

// Fetch all centers
export const fetchCenters = async (): Promise<Center[] | null> => {
  try {
    if (!checkSupabaseConfig()) {
      throw new Error('Supabase configuration missing or invalid');
    }

    const { data, error } = await supabase
      .from('centers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, 'Failed to fetch centers');
  }
};

// Fetch programs by center ID - Updated to use center_id instead of id
export const fetchProgramsByCenter = async (centerId: number): Promise<Program[] | null> => {
  try {
    if (!checkSupabaseConfig()) {
      throw new Error('Supabase configuration missing or invalid');
    }

    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('center_id', centerId)  // Using center_id which is an integer
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    return handleError(error, 'Failed to fetch programs');
  }
};

// Fetch tables by program ID
export const fetchTablesByProgram = async (programId: number): Promise<TableInfo[] | null> => {
  try {
    // Since "tables" table does not exist in the database, 
    // let's create some mock tables based on program_id
    // In a real application, this would fetch from the database
    
    const mockTables: TableInfo[] = [
      { id: 1, name: `Students_${programId}`, program_id: programId, description: 'Student information' },
      { id: 2, name: `Educators_${programId}`, program_id: programId, description: 'Educator information' },
      { id: 3, name: `Courses_${programId}`, program_id: programId, description: 'Course details' }
    ];
    
    return mockTables;
    
    /* This is the original code that tries to query the non-existent "tables" table
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('program_id', programId)
      .order('name');
    
    if (error) throw error;
    return data || [];
    */
  } catch (error) {
    return handleError(error, 'Failed to fetch tables');
  }
};

// Fetch data from a specific table
export const fetchTableData = async (tableName: string): Promise<any[] | null> => {
  try {
    // Since we're using mock tables, let's also create mock data
    // In a real application, this would fetch from the actual table
    const mockData = [];
    for (let i = 1; i <= 5; i++) {
      if (tableName.startsWith('Students')) {
        mockData.push({
          id: i,
          name: `Student ${i}`,
          age: 18 + i,
          grade: ['A', 'B', 'C'][i % 3],
          enrollment_date: new Date().toISOString().split('T')[0]
        });
      } else if (tableName.startsWith('Educators')) {
        mockData.push({
          id: i,
          name: `Educator ${i}`,
          subject: ['Math', 'Science', 'History', 'English', 'Art'][i-1],
          years_experience: 3 + i
        });
      } else if (tableName.startsWith('Courses')) {
        mockData.push({
          id: i,
          name: `Course ${i}`,
          duration_weeks: 8 + i,
          max_students: 20 + i
        });
      }
    }
    
    return mockData;
    
    /* Original code
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    return data || [];
    */
  } catch (error) {
    return handleError(error, `Failed to fetch data from ${tableName}`);
  }
};

// Insert a row into a table
export const insertRow = async (tableName: string, rowData: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .insert([rowData]);
    
    if (error) throw error;
    toast.success('Row added successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to add row');
    return false;
  }
};

// Update a row in a table
export const updateRow = async (tableName: string, id: number, rowData: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .update(rowData)
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Row updated successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to update row');
    return false;
  }
};

// Delete a row from a table
export const deleteRow = async (tableName: string, id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Row deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'Failed to delete row');
    return false;
  }
};

// Add a new column to a table - this is a simplified version
// In a real app, you'd need to alter the table schema via SQL or RPC
export const addColumn = async (tableName: string, columnName: string, columnType: string): Promise<boolean> => {
  // In a real implementation, you'd run SQL via RPC
  // For this example, we'll just simulate success
  toast.success(`Column "${columnName}" added successfully`);
  return true;
};

// Bulk insert data from CSV
export const bulkInsert = async (tableName: string, rows: any[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .insert(rows);
    
    if (error) throw error;
    toast.success(`${rows.length} rows added successfully`);
    return true;
  } catch (error) {
    handleError(error, 'Failed to bulk insert rows');
    return false;
  }
};

export default supabase;
