import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://inoctddkrskdegturzkq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub2N0ZGRrcnNrZGVndHVyemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDQ1MDMsImV4cCI6MjA2MjMyMDUwM30.OrV3MpLOFOnRRNGf486vGTalT0cOhBTs25Nw1xdJMgI');

export default supabase;
