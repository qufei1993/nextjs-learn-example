const { Client } = require('pg');

const client = new Client(process.env.POSTGRES_URL);

exports.getClient = async () => {
   if (!client._connected) {
      await client.connect();
   }

   // 适配这样的语句查询数据：client.sql`SHOW TIME ZONE;`
   client.sql = async (strings, ...values) => {
      if (!strings) {
         throw new ('sql is required')
      }
      const [query, params] = sqlTemplate(strings, values)
      const res = await client.query(query, params[0]);
      return res;
   }

   return client;
}

function sqlTemplate(strings, ...values) {
   if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
     throw new Error(
       'incorrect_tagged_template_call',
       "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')",
     );
   }
 
   let result = strings[0] ?? '';
 
   for (let i = 1; i < strings.length; i++) {
     result += `$${i}${strings[i] ?? ''}`;
   }
 
   return [result, values];
}
 
function isTemplateStringsArray(strings) {
   return (
      Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
   );
}

// (async () => {
//    // Test
//    try {
//       const clientInstance = await exports.getClient(); 
//       const res = await clientInstance.sql`SHOW TIME ZONE;`
//       console.log(res.rows[0].TimeZone) // 'Etc/UTC'
//    } catch (err) {
//       console.error(err);
//    } finally {
//       await client.end()
//    }
// })();