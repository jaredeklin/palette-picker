const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static('public'))

// app.get('/', (request, response) => {
//   response.send('oh snap! we servering!!!!!');
// });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on localhost:${app.get('port')}.`);
});