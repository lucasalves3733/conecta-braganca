const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('pontos_coleta').select('id, nome, user_id, created_at');
  if (error) console.error(error);
  else console.log('Pontos no banco:', data);
}

check();
