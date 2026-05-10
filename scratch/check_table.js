const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('pontos_coleta').select('*').limit(1);
  if (error) {
    // Se der erro de coluna não encontrada, vamos tentar pegar o erro detalhado
    console.error('ERRO:', error.message);
  } else {
    if (data.length > 0) {
      console.log('Colunas encontradas:', Object.keys(data[0]));
    } else {
      console.log('Tabela vazia, não consigo ver as colunas por SELECT *');
    }
  }
}

check();
