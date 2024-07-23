import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hniaicnwwwrwkhxnfhsg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaWFpY253d3dyd2toeG5maHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3MjgyNTIsImV4cCI6MjAzNzMwNDI1Mn0.TpQD6_FzWo-o41FgibcuuwilwNbpK5UIukxGvzcin-Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
