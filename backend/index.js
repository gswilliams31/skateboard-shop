require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const apiRouter = require('./api');
const userRouter = require('./api/usersRouter');
const productsRouter = require('./api/productsRouter');
const reviewsRouter = require('./api/reviewsRouter');
const cartRouter = require('./api/cartRouter');

const client = require('./db/index');

const connectDb = async () => {
  try{
    await client.connect();
    console.log("connected")
  } catch(err){
    console.log("Could not connect")
  }
}

connectDb()

const server = express();
const PORT = 3001;

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());
server.use((req, res, next) => {
  console.log('Hitting server')
  next();
})

server.use('/categories', async (req, res) => {
  const cat = 'SELECT category FROM products'
  client.query(cat, (err, req, res) =>{
    if(err){
      console.log(err.stack)
    }else{
      const t = req.rows
      const p=t.map(a)
      console.log(p)
    }
  })
  // res.send(res.rows)
  // try {
    // const categories = await getProductCategories();
    // res.send(categories)

    // const category = await client.query(`
    //   SELECT category
    //   FROM products;  
    // `, [category]);
    // console.log(category)

  //   } catch (error) {
  //   throw error;
  // }
})

server.use('/api', apiRouter);
server.use('/api/users', userRouter);
server.use('/api/products', productsRouter);
server.use('/api/reviews', reviewsRouter);
server.use('/api/cart', cartRouter);

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})
