import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and Anon Key from Project Settings > API
const supabaseUrl = 'https://odbpjjfsfxydvqvrlsao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kYnBqamZzZnh5ZHZxdnJsc2FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkyNzc5MywiZXhwIjoyMDg3NTAzNzkzfQ.jZnhsCCaJHH_-i5-YarJPK8bnSA7ZjCbiui-kRWq9uY';

export const supabase = createClient(supabaseUrl, supabaseKey);