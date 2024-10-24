import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCarousel from '../components/ProductCarousel';
import UserNavbar from '../components/UserNavbar';

const UserDashboard = () => {
    const [products, setProducts] = useState({});
    const [sellerName, setSellerName] = useState('');
    const userId = useParams().id;

    useEffect(() => {
        localStorage.setItem('userID', userId);

        // Fetch user name using axios
        axios.post('http://localhost:5000/get_username', { user_id: userId })
            .then(response => setSellerName(response.data.name || ''))
            .catch(error => console.error('Error fetching user name:', error));

        // Fetch products from the backend using axios
        axios.post('http://localhost:5000/user/products', { user_id: userId })
            .then(response => {
                const products = response.data.products || [];
                // Classifying the products into categories
                const categories = {};
                products.forEach(product => {
                    if (!categories[product.category]) {
                        categories[product.category] = [];
                    }
                    categories[product.category].push(product);
                });
                setProducts(categories);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [userId]);

    return (
        <>
            <UserNavbar sellerName={sellerName} />
            <div className="p-4 bg-gray-100">
                <h2>Products</h2>
                {Object.keys(products).map((category, index) => (
                    <div key={index} className="my-4">
                        <h3 className="text-xl font-bold">{category}</h3>
                        <ProductCarousel products={products[category]} userId={userId} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default UserDashboard;
