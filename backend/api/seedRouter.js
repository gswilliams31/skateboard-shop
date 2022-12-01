




seedRouter.post('/', async (req, res, next) => {

    try {
  
      const products = await getAllProducts();
      res.send(products)
  
    } catch (error) {
      throw error;
    }
  
  });