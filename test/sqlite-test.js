const etl = require('../index');
const data = require('./data');
const Promise = require('bluebird');
const Database = require('better-sqlite3');
const t = require('tap');

t.test('sqlite', {autoend:true}, async t => {

  t.test('pipe into table',async t => {
    
    const db = new Database("memory.db", { memory: true });
    let table = etl.sqlite.table(db, 'my_table');
    let headers = [
      {
        name: 'text',
        type: 'TEXT'
      },
      {
        name: 'name',
        type: 'TEXT'
      },
      {
        name: 'age',
        type: 'INTEGER'
      }
    ];
    table.create(headers);

    let i = 0;
    const d = await data.stream()
      .pipe(etl.map(d => {
        d._id = i++;
        return d;
      }))
      .pipe(etl.collect(100))
      .pipe(etl.sqlite.insert(table))
      .promise();
  });


  // t.test('etl.elastic.scroll()',async t => {
  //   const scroll = etl.elastic.scroll(client,{index: 'test', type: 'test', size: 1},{ highWaterMark: 0 });
  //   // setting highWaterMark to zero and size = 1 allows us to test for backpressure
  //   // a missing scroll_id would indicate that scrolling has finished pre-emptively
  //   const d = await scroll.pipe(etl.map(d => {
  //     t.ok(scroll.scroll_id && scroll.scroll_id.length,'Scroll id available - backpressure is managed');
  //     return Promise.delay(200).then(() => d);
  //   },{highWaterMark: 0}))
  //   .promise();

  //   t.same(scroll.scroll_id,undefined,'scrolling has finished');  // scrolling has finished
  //   t.same(convertHits(d),data.data,'returns original data');
  // });

});
