import axios from 'axios';
import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const { state, dispatch: cxtDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    cxtDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button disabled variant="light">
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
