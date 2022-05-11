import { Link } from 'react-router-dom';

import ProductCard from '../product-card/product-card.component';

import './category-preview.styles.scss';

//category preview shows the first 4 object
const CategoryPreview = ({ title, products }) => (
    <div className='category-preview-container'>
        <h2>
            <Link className='title' to={title}>
                {title.toUpperCase()}
            </Link>
        </h2>
        <div className='preview'>
            {products
                .filter((_, idx) => idx < 4)// "_" for not using first param and idx=index 
                .map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
        </div>
    </div>
);

export default CategoryPreview;