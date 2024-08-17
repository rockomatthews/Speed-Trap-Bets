// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxowkqmiflqvnzgkirna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4b3drcW1pZmxxdm56Z2tpcm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4NTc1MjEsImV4cCI6MjAzOTQzMzUyMX0.oSE0AVlweIhuTTKI1692mtU8d0X22d2MPxSU6S6BcHo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
